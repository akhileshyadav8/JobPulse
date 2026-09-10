import httpx
from typing import List, Optional
from datetime import datetime
from tenacity import retry, stop_after_attempt, wait_exponential
from bs4 import BeautifulSoup
from app.connectors.base import ATSConnector, RawJob
from app.models.company import Company

class LeverConnector(ATSConnector):
    BASE_URL = "https://api.lever.co/v0/postings/{}?mode=json"

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def fetch_jobs(self, company: Company) -> List[RawJob]:
        company_slug = company.ats_identifier or company.slug
        url = self.BASE_URL.format(company_slug)
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=30.0)
            response.raise_for_status()
            data = response.json()
            
        jobs = []
        for job_data in data:
            desc_html = job_data.get("descriptionPlain", "") + "\n" + job_data.get("lists", "")
            if not desc_html and "description" in job_data:
                desc_html = job_data["description"]
            
            soup = BeautifulSoup(desc_html, "html.parser")
            desc_text = soup.get_text(separator="\n", strip=True) or desc_html
            
            categories = job_data.get("categories", {})
            location = categories.get("location")
            team = categories.get("team")
            commitment = categories.get("commitment")
            
            posted_at = None
            if job_data.get("createdAt"):
                try:
                    posted_at = datetime.fromtimestamp(job_data.get("createdAt") / 1000.0)
                except Exception:
                    pass
            
            job = RawJob(
                external_id=str(job_data.get("id")),
                title=job_data.get("text", ""),
                description_html=desc_html,
                description_text=desc_text,
                location=[location] if location else [],
                department=team,
                employment_type=commitment,
                job_url=job_data.get("hostedUrl", ""),
                apply_url=job_data.get("applyUrl", ""),
                posted_at=posted_at,
                raw_data=job_data
            )
            jobs.append(job)
        return jobs

    async def fetch_job_detail(self, company: Company, job_id: str) -> Optional[RawJob]:
        # Lever API returns all jobs, just filter it
        jobs = await self.fetch_jobs(company)
        for job in jobs:
            if job.external_id == job_id:
                return job
        return None
