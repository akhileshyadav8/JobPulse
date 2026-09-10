from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from datetime import datetime, timedelta
from app.models.company import Company
from app.models.job import Job

class CompanyService:
    @staticmethod
    async def list_companies(session: AsyncSession, page: int = 1, size: int = 20) -> Tuple[List[Company], int]:
        query = select(Company).where(Company.is_active == True)
        
        count_query = select(func.count()).select_from(query.subquery())
        total = await session.scalar(count_query)
        
        query = query.order_by(Company.name).offset((page - 1) * size).limit(size)
        result = await session.execute(query)
        return list(result.scalars().all()), total

    @staticmethod
    async def get_company_by_slug(session: AsyncSession, slug: str) -> Optional[Company]:
        query = select(Company).where(Company.slug == slug)
        result = await session.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_company_jobs(session: AsyncSession, company_slug: str, page: int = 1, size: int = 20) -> Tuple[List[Job], int]:
        # Simple fetch of active jobs for a company
        query = select(Job).join(Company).where(
            Company.slug == company_slug,
            Job.status == 'active'
        ).order_by(desc(Job.first_seen_at))
        
        count_query = select(func.count()).select_from(query.subquery())
        total = await session.scalar(count_query)
        
        query = query.offset((page - 1) * size).limit(size)
        result = await session.execute(query)
        return list(result.scalars().all()), total

    @staticmethod
    async def get_company_stats(session: AsyncSession, company_slug: str) -> Dict[str, Any]:
        # Active job count
        active_count_q = select(func.count(Job.id)).join(Company).where(
            Company.slug == company_slug,
            Job.status == 'active'
        )
        active_count = await session.scalar(active_count_q)
        
        # New in last 7 days
        cutoff = func.now() - timedelta(days=7)
        recent_count_q = select(func.count(Job.id)).join(Company).where(
            Company.slug == company_slug,
            Job.first_seen_at >= cutoff
        )
        recent_count = await session.scalar(recent_count_q)
        
        return {
            "active_jobs": active_count,
            "new_jobs_last_7_days": recent_count
        }
