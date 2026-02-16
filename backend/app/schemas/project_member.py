from pydantic import BaseModel
from typing import List

class MemberItem(BaseModel):
    user_id: int
    role: str

class UpdateRole(BaseModel):
    role: str

class ProjectMemberCreate(BaseModel):
    project_id: int
    members: List[MemberItem]

class ProjectMemberResponse(BaseModel):
    id: int
    project_id: int
    user_id: int
    role: str

    class Config:
        from_attributes = True
