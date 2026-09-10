import httpx
from typing import List, Optional
from bs4 import BeautifulSoup
from tenacity import retry, stop_after_attempt, wait_exponential
from app.connectors.base import ATSConnector, RawJob
from app.models.company import Company

class GreenhouseConnector(ATSConnector):
    BASE_URL = "https://boards-api.greenhouse.io/v1/boards/{}/jobs"

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def fetch_jobs(self, company: Company) -> List[RawJob]:
        board_token = company.ats_identifier or company.slug
        url = self.BASE_URL.format(board_token)
        
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{url}?content=true", timeout=30.0)
            response.raise_for_status()
            data = response.json()
            
        jobs = []
        for job_data in data.get("jobs", []):
            soup = BeautifulSoup(job_data.get("content", ""), "html.parser")
            desc_text = soup.get_text(separator="\n", strip=True)
            
            departments = job_data.get("departments", [])
            department = departments[0].get("name") if departments else None
            
            job = RawJob(
                external_id=str(job_data.get("id")),
                title=job_data.get("title", ""),
                description_html=job_data.get("content"),
                description_text=desc_text,
                location=[job_data.get("location", {}).get("name", "")] if job_data.get("location") else [],
                department=department,
                job_url=job_data.get("absolute_url", ""),
                apply_url=job_data.get("absolute_url", "") + "#app",
                raw_data=job_data
            )
            jobs.append(job)
        return jobs

    async def fetch_job_detail(self, company: Company, job_id: str) -> Optional[RawJob]:
        board_token = company.ats_identifier or company.slug
        url = f"https://boards-api.greenhouse.io/v1/boards/{board_token}/jobs/{job_id}"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{url}?content=true", timeout=30.0)
            if response.status_code == 404:
                return None
            response.raise_for_status()
            job_data = response.json()
            
            soup = BeautifulSoup(job_data.get("content", ""), "html.parser")
            desc_text = soup.get_text(separator="\n", strip=True)
            
            departments = job_data.get("departments", [])
            department = departments[0].get("name") if departments else None
            
            return RawJob(
                external_id=str(job_data.get("id")),
                title=job_data.get("title", ""),
                description_html=job_data.get("content"),
                description_text=desc_text,
                location=[job_data.get("location", {}).get("name", "")] if job_data.get("location") else [],
                department=department,
                job_url=job_data.get("absolute_url", ""),
                apply_url=job_data.get("absolute_url", "") + "#app",
                raw_data=job_data
            )
