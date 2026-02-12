from pydantic import BaseModel 
from typing import Optional
from .models import IssueStatus
class IssueCreate(BaseModel):
    title:str 
    description:str 
    project_id:int

class IssueAssign(BaseModel):
    user_id:int 
    manager_id:int

class IssueStatusUpdate(BaseModel):
    status:IssueStatus 

class IssueResponse(BaseModel):
    id:int
    title:str
    description:str
    status:IssueStatus
    project_id:int
    raised_by:int
    assigned_to:Optional[int]
    
    class Config:
        from_attributes = True