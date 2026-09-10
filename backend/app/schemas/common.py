from typing import Generic, TypeVar, List, Optional
from pydantic import BaseModel

T = TypeVar("T")

class Pagination(BaseModel):
    total: int
    page: int
    size: int
    pages: int

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    pagination: Pagination

class HealthResponse(BaseModel):
    status: str
    version: str
