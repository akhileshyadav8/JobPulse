from typing import List, Optional
from datetime import datetime
from sqlalchemy import String, Integer, Text, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

class Company(Base):
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    website: Mapped[Optional[str]] = mapped_column(String(500))
    careers_url: Mapped[Optional[str]] = mapped_column(String(500))
    logo_url: Mapped[Optional[str]] = mapped_column(String(500))
    
    # ATS Info
    ats_type: Mapped[str] = mapped_column(String(50), default="unknown")
    ats_identifier: Mapped[Optional[str]] = mapped_column(String(255))
    
    # Metadata
    industry: Mapped[Optional[str]] = mapped_column(String(100))
    headquarters: Mapped[Optional[str]] = mapped_column(String(255))
    employee_count_range: Mapped[Optional[str]] = mapped_column(String(50))
    description: Mapped[Optional[str]] = mapped_column(Text)
    
    # Processing
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    poll_interval_minutes: Mapped[int] = mapped_column(Integer, default=10)
    last_checked_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    last_error: Mapped[Optional[str]] = mapped_column(Text)
    consecutive_errors: Mapped[int] = mapped_column(Integer, default=0)

    # Relationships
    jobs: Mapped[List["Job"]] = relationship("Job", back_populates="company", cascade="all, delete-orphan")
