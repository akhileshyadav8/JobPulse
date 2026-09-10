import asyncio
import re
from slugify import slugify
from app.workers.celery_app import celery_app
from app.database import AsyncSessionLocal
from app.models.job import Job
from app.models.skill import Skill
from sqlalchemy import select

async def async_normalize_job(job_id: int):
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Job).where(Job.id == job_id))
        job = result.scalar_one_or_none()
        if not job:
            return

        text = (job.description_text or "").lower()
        title = job.title.lower()

        # 1. Work Mode
        if "remote" in title or "remote" in text or "wfh" in text or "work from home" in text:
            job.work_mode = "remote"
        elif "hybrid" in title or "hybrid" in text:
            job.work_mode = "hybrid"
        else:
            job.work_mode = "onsite"

        # 2. Employment Type
        if "intern" in title or "internship" in title or "intern" in text:
            job.employment_type = "internship"
        elif "contract" in title or "contract" in text:
            job.employment_type = "contract"
        elif "part time" in title or "part-time" in title:
            job.employment_type = "parttime"
        else:
            job.employment_type = "fulltime"

        # 3. Simple Experience Regex (X-Y years)
        exp_match = re.search(r'(\d+)\s*(?:-|to)\s*(\d+)\s*(?:years?|yrs?)', text)
        if exp_match:
            job.experience_min = int(exp_match.group(1))
            job.experience_max = int(exp_match.group(2))
        else:
            single_exp = re.search(r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*experience', text)
            if single_exp:
                job.experience_min = int(single_exp.group(1))

        # 4. Salary simple extraction (LPA)
        lpa_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)\s*lpa', text)
        if lpa_match:
            job.salary_min = float(lpa_match.group(1)) * 100000
            job.salary_max = float(lpa_match.group(2)) * 100000
            job.salary_currency = "INR"

        # Trigger AI Extraction
        celery_app.send_task("app.ai.extractor.extract_ai_data", args=[job.id])
        await session.commit()

@celery_app.task
def normalize_job(job_id: int):
    asyncio.run(async_normalize_job(job_id))
