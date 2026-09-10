import asyncio
import json
import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import select
from app.config import settings
from app.models.company import Company
from app.models.skill import Skill

async def seed_data():
    engine = create_async_engine(settings.DATABASE_URL)
    Session = async_sessionmaker(engine)
    
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    companies_file = os.path.join(base_dir, "data", "companies_seed.json")
    skills_file = os.path.join(base_dir, "data", "skills_seed.json")
    
    async with Session() as session:
        # Seed Companies
        if os.path.exists(companies_file):
            with open(companies_file, "r") as f:
                companies_data = json.load(f)
                
            for c_data in companies_data:
                result = await session.execute(select(Company).where(Company.slug == c_data.get("slug")))
                if not result.scalar_one_or_none():
                    company = Company(**c_data)
                    session.add(company)
                    print(f"Added company: {c_data.get('name')}")
        
        # Seed Skills
        if os.path.exists(skills_file):
            with open(skills_file, "r") as f:
                skills_data = json.load(f)
                
            for s_data in skills_data:
                result = await session.execute(select(Skill).where(Skill.slug == s_data.get("slug")))
                if not result.scalar_one_or_none():
                    skill = Skill(**s_data)
                    session.add(skill)
                    print(f"Added skill: {s_data.get('name')}")
                    
        await session.commit()
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(seed_data())
