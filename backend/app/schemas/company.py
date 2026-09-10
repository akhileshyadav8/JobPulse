from typing import Optional, List, Any
from datetime import datetime
from pydantic import BaseModel, Field

class CompanyBase(BaseModel):
    name: str
    slug: str
    website: Optional[str] = None
    careers_url: Optional[str] = None
    logo_url: Optional[str] = None
    ats_type: str = "unknown"
    industry: Optional[str] = None
    headquarters: Optional[str] = None
    employee_count_range: Optional[str] = None
    description: Optional[str] = None

class CompanyCreate(CompanyBase):
    ats_identifier: Optional[str] = None

class CompanyListItem(CompanyBase):
    id: int
    is_active: bool
    last_checked_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

class CompanyResponse(CompanyListItem):
    ats_identifier: Optional[str] = None
    poll_interval_minutes: int
    consecutive_errors: int
    last_error: Optional[str] = None

class CompanyWithJobs(CompanyResponse):
    # This will be populated after defining JobListItem
    jobs: List[Any] = []
