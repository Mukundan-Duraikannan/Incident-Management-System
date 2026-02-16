from pydantic import BaseModel
from typing import Optional
from datetime import datetime
class TicketCreate(BaseModel):
    project_title: str  
    issue: str
    description: str
    category: str
    
class TicketUpdate(BaseModel):
    project_title: Optional[str] = None
    issue: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    class Config:
        extra = "forbid"
class TicketResponse(BaseModel):
    id: int
    email: str
    project_title: str
    issue: str
    description: str
    category: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True 