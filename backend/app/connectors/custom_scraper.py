import httpx
from typing import List, Optional
from bs4 import BeautifulSoup
import json
from app.connectors.base import ATSConnector, RawJob
from app.models.company import Company

class CustomScraper(ATSConnector):
    
    async def fetch_jobs(self, company: Company) -> List[RawJob]:
        if not company.careers_url:
            return []
            
        async with httpx.AsyncClient(follow_redirects=True) as client:
            try:
                response = await client.get(company.careers_url, timeout=30.0)
                response.raise_for_status()
            except Exception:
                return []
                
        soup = BeautifulSoup(response.text, "html.parser")
        
        # Look for JSON-LD
        jobs = []
        for script in soup.find_all("script", type="application/ld+json"):
            try:
                data = json.loads(script.string)
                if isinstance(data, dict):
                    data = [data]
                for item in data:
                    if item.get("@type") == "JobPosting":
                        desc = item.get("description", "")
                        desc_soup = BeautifulSoup(desc, "html.parser")
                        jobs.append(RawJob(
                            external_id=item.get("identifier", {}).get("value", ""),
                            title=item.get("title", ""),
                            description_html=desc,
                            description_text=desc_soup.get_text(separator="\n", strip=True),
                            job_url=company.careers_url, # Fallback
                            raw_data=item
                        ))
            except Exception:
                continue
                
        return jobs

    async def fetch_job_detail(self, company: Company, job_id: str) -> Optional[RawJob]:
        return None
