from pydantic import BaseModel 
from typing import Optional
from .models import IssueStatus
from enum import Enum
class PriorityEnum(str,Enum):
    low="low"
    medium="medium"
    high="high"
    critical="critical"

class IssueCreate(BaseModel):
    title:str 
    description:str 

class IssueAssign(BaseModel):
    user_id:int 
    priority:PriorityEnum

class IssueStatusUpdate(BaseModel):
    status:IssueStatus 

class IssueResponse(BaseModel):
    id:int
    title:str
    description:str
    status:IssueStatus
    project_id:int
    raised_by:int
    priority:PriorityEnum
    assigned_to:Optional[int]
    
    class Config:
        from_attributes = True