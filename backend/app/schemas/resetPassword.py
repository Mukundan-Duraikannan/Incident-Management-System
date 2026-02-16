from pydantic import BaseModel, EmailStr

class ForgotPassword(BaseModel):
    email: EmailStr

class ResetPassword(BaseModel):
    email: EmailStr
    otp: str
    newPassword: str
