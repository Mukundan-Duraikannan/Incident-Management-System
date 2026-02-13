from pydantic import BaseModel


class ProjectCreate(BaseModel):
    name: str
    description: str
    admin_id: int


class ProjectUpdate(BaseModel):
    name: str
    description: str


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: str


class Config:
    from_attributes = True
