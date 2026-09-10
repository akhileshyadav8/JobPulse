from fastapi import APIRouter, Depends, Query, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.database import get_db
from app.schemas.job import JobResponse, JobListItem, JobFilters, JobEventSchema
from app.schemas.common import PaginatedResponse, Pagination
from app.services.job_service import JobService

router = APIRouter()

@router.get("", response_model=PaginatedResponse[JobListItem])
async def list_jobs(
    filters: JobFilters = Depends(),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    jobs, total = await JobService.list_jobs(db, filters, page, size)
    pages = (total + size - 1) // size
    return PaginatedResponse(
        items=jobs,
        pagination=Pagination(total=total, page=page, size=size, pages=pages)
    )

@router.get("/recent", response_model=List[JobListItem])
async def get_recent_jobs(
    minutes: int = Query(60, ge=1, le=1440),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    return await JobService.get_recent_jobs(db, minutes=minutes, limit=limit)

@router.get("/trending", response_model=List[JobListItem])
async def get_trending_jobs(
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    return await JobService.get_trending_jobs(db, limit=limit)

@router.get("/{slug}", response_model=JobResponse)
async def get_job_by_slug(
    slug: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    job = await JobService.get_job_by_slug(db, slug)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    background_tasks.add_task(JobService.increment_view_count, db, job.id)
    return job

@router.get("/{slug}/events", response_model=List[JobEventSchema])
async def get_job_events(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    job = await JobService.get_job_by_slug(db, slug)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    events = await JobService.get_job_events(db, job.id)
    return events
