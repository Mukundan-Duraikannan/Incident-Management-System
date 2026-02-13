from pydantic import BaseModel
from typing import Optional
from models.issue import IssueStatus, Priority


class IssueCreate(BaseModel):
    title: str
    description: str
    category_id: int
    project_id: int
    raised_by: int


class IssueAssign(BaseModel):
    user_id: int
    manager_id: int
    priority: Priority


class IssueStatusUpdate(BaseModel):
    status: IssueStatus
    user_id:int

class IssueResponse(BaseModel):
    id: int
    title: str
    description: str
    status: IssueStatus
    priority: Optional[Priority] = None
    category_id: int
    project_id: int
    raised_by: int
    assigned_to: Optional[int]
    handled_by_manager: Optional[int]

    class Config:
        from_attributes = True
