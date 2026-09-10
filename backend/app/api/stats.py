from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta
from app.database import get_db
from app.schemas.stats import OverviewStats, FreshnessStats
from app.models.job import Job
from app.models.company import Company

router = APIRouter()

@router.get("/overview", response_model=OverviewStats)
async def get_overview_stats(db: AsyncSession = Depends(get_db)):
    total_jobs = await db.scalar(select(func.count(Job.id)).where(Job.status == 'active')) or 0
    total_companies = await db.scalar(select(func.count(Company.id)).where(Company.is_active == True)) or 0
    
    today = func.now() - timedelta(days=1)
    hour = func.now() - timedelta(hours=1)
    
    new_jobs_today = await db.scalar(
        select(func.count(Job.id)).where(Job.first_seen_at >= today)
    ) or 0
    
    new_jobs_this_hour = await db.scalar(
        select(func.count(Job.id)).where(Job.first_seen_at >= hour)
    ) or 0
    
    return OverviewStats(
        total_jobs=total_jobs,
        total_companies=total_companies,
        new_jobs_today=new_jobs_today,
        new_jobs_this_hour=new_jobs_this_hour
    )

@router.get("/freshness", response_model=FreshnessStats)
async def get_freshness_stats(db: AsyncSession = Depends(get_db)):
    # Calculate avg detection latency: differences between posted_at and first_seen_at
    # This might be tricky in raw SQL depending on dialect, but we can do a simple average if posted_at exists
    query = select(func.avg(func.extract('epoch', Job.first_seen_at - Job.posted_at))).where(Job.posted_at != None)
    avg_seconds = await db.scalar(query) or 0
    avg_minutes = avg_seconds / 60.0
    
    return FreshnessStats(
        avg_detection_latency_minutes=avg_minutes
    )
