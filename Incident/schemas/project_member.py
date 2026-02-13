from pydantic import BaseModel


class MemberCreate(BaseModel):
    project_id: int
    user_id: int
    admin_id: int
    role: str
    is_temporary: bool = False


class MemberUpdate(BaseModel):
    role: str
    is_temporary: bool


class MemberResponse(BaseModel):
    id: int
    project_id: int
    user_id: int
    role: str
    is_temporary: bool

    class Config:
        from_attributes = True
