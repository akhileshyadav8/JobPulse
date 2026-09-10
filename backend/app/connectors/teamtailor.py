import httpx
from typing import List, Optional
from tenacity import retry, stop_after_attempt, wait_exponential
from bs4 import BeautifulSoup
from app.connectors.base import ATSConnector, RawJob
from app.models.company import Company

class TeamTailorConnector(ATSConnector):
    BASE_URL = "https://{}.teamtailor.com/jobs.json"

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def fetch_jobs(self, company: Company) -> List[RawJob]:
        slug = company.ats_identifier or company.slug
        url = self.BASE_URL.format(slug)
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=30.0)
            if response.status_code == 404:
                return []
            response.raise_for_status()
            data = response.json()
            
        jobs = []
        for job_data in data:
            desc_html = job_data.get("body", "")
            soup = BeautifulSoup(desc_html, "html.parser")
            desc_text = soup.get_text(separator="\n", strip=True)
            
            job = RawJob(
                external_id=str(job_data.get("id")),
                title=job_data.get("title", ""),
                description_html=desc_html,
                description_text=desc_text,
                location=[], # Often not clearly in this endpoint, need detailed API
                job_url=job_data.get("url", ""),
                raw_data=job_data
            )
            jobs.append(job)
        return jobs

    async def fetch_job_detail(self, company: Company, job_id: str) -> Optional[RawJob]:
        jobs = await self.fetch_jobs(company)
        for job in jobs:
            if job.external_id == job_id:
                return job
        return None
