from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    name:str
    email:str
    password:str

class ShowUser(BaseModel):
    id:int
    name:str
    email:str
    model_config={
        "from_attributes": True
        }
class UpdateUser(BaseModel):
    name:str
    email:str
    isActive:bool

class Login(BaseModel):
    email:str
    password:str

class ForgotPassword(BaseModel):
    email:str

class ResetPassword(BaseModel):
    token:str
    newPassword:str

class Token(BaseModel):
    access_token:str
    token_type:str

class TokenData(BaseModel):
    email:Optional[str]=None

class ProjectCreate(BaseModel):
    name:str
    description:str

class ProjectUpdate(BaseModel):
    name:str
    description:str

class ProjectResponse(BaseModel):
    id:int
    name:str
    description:str

    class Config:
        from_attributes=True

##update

class AddMember(BaseModel):
    user_id:int
    role:str 
class MemberResponse(BaseModel):
    user_id:int 
    role:str 
    class Config:
        from_attributes=True 

class MemberUpdate(BaseModel):
    user_id:int 
    role:str 

