import asyncio
import google.generativeai as genai
from pydantic import BaseModel
from typing import List, Optional
from app.workers.celery_app import celery_app
from app.database import AsyncSessionLocal
from app.models.job import Job
from app.config import settings
from sqlalchemy import select

class ExtractedJobData(BaseModel):
    skills_required: List[str]
    skills_preferred: List[str]
    salary_min: Optional[float]
    salary_max: Optional[float]
    salary_currency: Optional[str]
    experience_min: Optional[int]
    experience_max: Optional[int]
    education: Optional[str]
    eligible_batches: List[str]
    work_mode: Optional[str]

genai.configure(api_key=settings.GEMINI_API_KEY)

async def async_extract_ai_data(job_id: int):
    if not settings.GEMINI_API_KEY:
        return
        
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Job).where(Job.id == job_id))
        job = result.scalar_one_or_none()
        if not job or not job.description_text:
            return

        prompt = f"""
        Extract structured data from the following job description.
        Job Title: {job.title}
        
        Description:
        {job.description_text[:4000]}
        """

        try:
            model = genai.GenerativeModel('gemini-2.0-flash')
            response = model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=ExtractedJobData,
                )
            )
            
            import json
            data = json.loads(response.text)
            
            if data.get("skills_required"): job.skills_required = data.get("skills_required")
            if data.get("skills_preferred"): job.skills_preferred = data.get("skills_preferred")
            
            if not job.salary_min and data.get("salary_min"):
                job.salary_min = data.get("salary_min")
                job.salary_max = data.get("salary_max")
                job.salary_currency = data.get("salary_currency", "INR")
                
            if not job.experience_min and data.get("experience_min") is not None:
                job.experience_min = data.get("experience_min")
                job.experience_max = data.get("experience_max")
                
            if data.get("education"): job.education = data.get("education")
            if data.get("eligible_batches"): job.eligible_batches = data.get("eligible_batches")
            
            if not job.work_mode and data.get("work_mode"):
                job.work_mode = data.get("work_mode").lower()
                
            await session.commit()
            
            # Trigger enricher
            celery_app.send_task("app.ai.enricher.enrich_job", args=[job.id])
            
        except Exception as e:
            print(f"AI Extraction failed for {job_id}: {e}")

@celery_app.task
def extract_ai_data(job_id: int):
    asyncio.run(async_extract_ai_data(job_id))
