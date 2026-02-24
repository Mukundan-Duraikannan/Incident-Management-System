from pydantic import BaseModel
from typing import Optional


class User(BaseModel):
    name: str
    email: str
    password: str
    role: str = "user"


class ShowUser(BaseModel):
    id: int
    name: str
    email: str
    model_config = {
        "from_attributes": True
    }


class UpdateUser(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    isActive: Optional[bool] = None


class Login(BaseModel):
    email: str
    password: str


class ForgotPassword(BaseModel):
    email: str


class VerifyOTP(BaseModel):
    email: str
    otp: str


class ResetPassword(BaseModel):
    email: str
    otp: str
    newPassword: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class ProjectCreate(BaseModel):
    name: str
    description: str


class ProjectUpdate(BaseModel):
    name: str
    description: str


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: str

    class Config:
        from_attributes = True


class AddMember(BaseModel):
    user_id: int
    role: str


class MemberResponse(BaseModel):
    project_id: int
    user_id: int
    role: str

    class Config:
        from_attributes = True


class MemberUpdate(BaseModel):
    user_id: int
    role: str
