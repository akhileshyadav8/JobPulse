from abc import ABC, abstractmethod
from typing import List, Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel
from app.models.company import Company

class RawJob(BaseModel):
    external_id: str
    title: str
    description_html: Optional[str] = None
    description_text: Optional[str] = None
    location: List[str] = []
    department: Optional[str] = None
    employment_type: Optional[str] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    salary_currency: str = "INR"
    job_url: str = ""
    apply_url: Optional[str] = None
    posted_at: Optional[datetime] = None
    raw_data: Dict[str, Any] = {}

class ATSConnector(ABC):
    @abstractmethod
    async def fetch_jobs(self, company: Company) -> List[RawJob]:
        """Fetch all jobs for a given company."""
        pass
        
    @abstractmethod
    async def fetch_job_detail(self, company: Company, job_id: str) -> Optional[RawJob]:
        """Fetch details for a specific job."""
        pass
