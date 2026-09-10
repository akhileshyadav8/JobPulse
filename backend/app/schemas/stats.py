from pydantic import BaseModel

class OverviewStats(BaseModel):
    total_jobs: int
    total_companies: int
    new_jobs_today: int
    new_jobs_this_hour: int

class FreshnessStats(BaseModel):
    avg_detection_latency_minutes: float
