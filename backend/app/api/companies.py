from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any
from app.database import get_db
from app.schemas.company import CompanyResponse, CompanyListItem
from app.schemas.job import JobListItem
from app.schemas.common import PaginatedResponse, Pagination
from app.services.company_service import CompanyService

router = APIRouter()

@router.get("", response_model=PaginatedResponse[CompanyListItem])
async def list_companies(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    companies, total = await CompanyService.list_companies(db, page, size)
    pages = (total + size - 1) // size
    return PaginatedResponse(
        items=companies,
        pagination=Pagination(total=total, page=page, size=size, pages=pages)
    )

@router.get("/{slug}", response_model=CompanyResponse)
async def get_company_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    company = await CompanyService.get_company_by_slug(db, slug)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

@router.get("/{slug}/jobs", response_model=PaginatedResponse[JobListItem])
async def get_company_jobs(
    slug: str,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    jobs, total = await CompanyService.get_company_jobs(db, slug, page, size)
    pages = (total + size - 1) // size
    return PaginatedResponse(
        items=jobs,
        pagination=Pagination(total=total, page=page, size=size, pages=pages)
    )

@router.get("/{slug}/stats")
async def get_company_stats(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    company = await CompanyService.get_company_by_slug(db, slug)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
        
    return await CompanyService.get_company_stats(db, slug)
