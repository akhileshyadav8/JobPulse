from fastapi import APIRouter
from app.api import jobs, companies, stats

api_router = APIRouter()
api_router.include_router(jobs.router, prefix="/jobs", tags=["Jobs"])
api_router.include_router(companies.router, prefix="/companies", tags=["Companies"])
api_router.include_router(stats.router, prefix="/stats", tags=["Stats"])
