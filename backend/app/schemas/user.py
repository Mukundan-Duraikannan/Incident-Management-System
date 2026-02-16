from pydantic import BaseModel
from typing import Optional
from datetime import datetime
class User(BaseModel):
    name: str
    email: str
    role: str


class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str


class ShowUser(BaseModel):
    id:int
    name: str
    email: str
    model_config = {
        "from_attributes": True
        }
class UpdateUser(BaseModel):
    name:str
    email:str
    isActive:bool

class Login(BaseModel):
    email: str
    password: str

class ForgotPassword(BaseModel):
    email: str

class ResetPassword(BaseModel):
    token: str
    newPassword: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role:str
class TokenData(BaseModel):
    email: Optional[str] = None

class RaiseTicketRequest(BaseModel):
    title: str
    description: str
    priority: str
