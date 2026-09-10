from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text, desc
from sqlalchemy.orm import selectinload
from datetime import datetime, timedelta
from app.models.job import Job
from app.models.company import Company
from app.models.job_event import JobEvent
from app.schemas.job import JobFilters

class JobService:
    @staticmethod
    async def list_jobs(session: AsyncSession, filters: JobFilters, page: int = 1, size: int = 20) -> Tuple[List[Job], int]:
        query = select(Job).options(selectinload(Job.company)).where(Job.status == filters.status)
        
        if filters.company_slug:
            query = query.join(Company).where(Company.slug == filters.company_slug)
        if filters.work_mode:
            query = query.where(Job.work_mode == filters.work_mode)
        if filters.employment_type:
            query = query.where(Job.employment_type == filters.employment_type)
        if filters.experience_max is not None:
            query = query.where(Job.experience_min <= filters.experience_max)
        if filters.salary_min is not None:
            query = query.where(Job.salary_max >= filters.salary_min)
            
        if filters.q:
            # Full text search using ts_vector
            search_query = text("to_tsvector('english', jobs.title || ' ' || coalesce(jobs.description_text, '')) @@ plainto_tsquery('english', :q)")
            query = query.where(search_query).params(q=filters.q)
            
        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        total = await session.scalar(count_query)
        
        # Pagination
        query = query.order_by(desc(Job.first_seen_at)).offset((page - 1) * size).limit(size)
        result = await session.execute(query)
        jobs = result.scalars().all()
        
        return list(jobs), total

    @staticmethod
    async def get_job_by_slug(session: AsyncSession, slug: str) -> Optional[Job]:
        query = select(Job).options(selectinload(Job.company), selectinload(Job.events)).where(Job.slug == slug)
        result = await session.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def increment_view_count(session: AsyncSession, job_id: int):
        job = await session.get(Job, job_id)
        if job:
            job.view_count += 1
            await session.commit()

    @staticmethod
    async def get_recent_jobs(session: AsyncSession, minutes: int = 60, limit: int = 20) -> List[Job]:
        cutoff = func.now() - timedelta(minutes=minutes)
        query = select(Job).options(selectinload(Job.company)).where(
            Job.first_seen_at >= cutoff,
            Job.status == 'active'
        ).order_by(desc(Job.first_seen_at)).limit(limit)
        
        result = await session.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def get_trending_jobs(session: AsyncSession, limit: int = 20) -> List[Job]:
        query = select(Job).options(selectinload(Job.company)).where(
            Job.status == 'active'
        ).order_by(desc(Job.view_count)).limit(limit)
        
        result = await session.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def get_job_events(session: AsyncSession, job_id: int) -> List[JobEvent]:
        query = select(JobEvent).where(JobEvent.job_id == job_id).order_by(desc(JobEvent.detected_at))
        result = await session.execute(query)
        return list(result.scalars().all())
