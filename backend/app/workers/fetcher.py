import asyncio
import hashlib
from typing import List, Optional
from sqlalchemy import select, update
from slugify import slugify
from app.workers.celery_app import celery_app
from app.database import AsyncSessionLocal
from app.models.company import Company
from app.models.job import Job
from app.models.job_event import JobEvent
from app.connectors import get_connector
from app.connectors.base import RawJob
import structlog

logger = structlog.get_logger()

def compute_hash(title: str, description_html: Optional[str]) -> str:
    content = f"{title}{description_html or ''}".encode('utf-8')
    return hashlib.sha256(content).hexdigest()

async def async_poll_company(company_id: int):
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Company).where(Company.id == company_id))
        company = result.scalar_one_or_none()
        if not company or not company.is_active:
            return
            
        connector = get_connector(company.ats_type)
        try:
            raw_jobs = await connector.fetch_jobs(company)
            await process_jobs(session, company, raw_jobs)
            
            company.last_checked_at = asyncio.get_event_loop().time() # just need now() in db, let's use func.now()
            from sqlalchemy.sql import func
            company.last_checked_at = func.now()
            company.consecutive_errors = 0
            company.last_error = None
            await session.commit()
            
        except Exception as e:
            logger.error("polling_error", company_id=company_id, error=str(e))
            company.consecutive_errors += 1
            company.last_error = str(e)
            await session.commit()

async def process_jobs(session, company: Company, raw_jobs: List[RawJob]):
    # Get existing active jobs
    result = await session.execute(
        select(Job).where(Job.company_id == company.id, Job.status == 'active')
    )
    existing_jobs = {job.external_id or job.title: job for job in result.scalars().all()}
    
    current_job_keys = set()
    
    for raw_job in raw_jobs:
        job_key = raw_job.external_id or raw_job.title
        current_job_keys.add(job_key)
        
        content_hash = compute_hash(raw_job.title, raw_job.description_html)
        
        if job_key not in existing_jobs:
            # New job
            new_job = Job(
                company_id=company.id,
                external_id=raw_job.external_id,
                title=raw_job.title,
                slug=slugify(f"{company.name}-{raw_job.title}-{raw_job.external_id or ''}")[:450],
                description_html=raw_job.description_html,
                description_text=raw_job.description_text,
                location=raw_job.location,
                department=raw_job.department,
                employment_type=raw_job.employment_type,
                job_url=raw_job.job_url,
                apply_url=raw_job.apply_url,
                posted_at=raw_job.posted_at,
                content_hash=content_hash,
                status="active"
            )
            session.add(new_job)
            await session.flush() # get ID
            
            event = JobEvent(job_id=new_job.id, event_type="new")
            session.add(event)
            
            # Trigger normalizer
            celery_app.send_task("app.workers.normalizer.normalize_job", args=[new_job.id])
            
        else:
            # Check for updates
            existing_job = existing_jobs[job_key]
            if existing_job.content_hash != content_hash:
                old_desc = existing_job.description_html
                
                existing_job.title = raw_job.title
                existing_job.description_html = raw_job.description_html
                existing_job.description_text = raw_job.description_text
                existing_job.content_hash = content_hash
                
                event = JobEvent(
                    job_id=existing_job.id,
                    event_type="description_changed",
                    field_changed="description",
                    old_value=old_desc,
                    new_value=raw_job.description_html
                )
                session.add(event)
                
                # Trigger normalizer for update
                celery_app.send_task("app.workers.normalizer.normalize_job", args=[existing_job.id])

    # Handle removed jobs
    for job_key, existing_job in existing_jobs.items():
        if job_key not in current_job_keys:
            existing_job.status = "removed"
            event = JobEvent(job_id=existing_job.id, event_type="removed")
            session.add(event)

@celery_app.task
def poll_company(company_id: int):
    asyncio.run(async_poll_company(company_id))

@celery_app.task
def dispatch_company_polling():
    async def dispatch():
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(Company.id).where(Company.is_active == True))
            for (company_id,) in result.all():
                poll_company.delay(company_id)
    asyncio.run(dispatch())
