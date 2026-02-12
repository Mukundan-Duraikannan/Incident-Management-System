from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from .. import database,schemas
from .. repository import resetPassword
router=APIRouter(tags=["Password Reset"])

@router.post("/forgotpassword")
async def forgot_password(request:schemas.ForgotPassword,db:Session=Depends(database.get_db)):
    return await resetPassword.forgot_password(request.email,db)

@router.post("/resetpassword")
def reset_password(request:schemas.ResetPassword,db:Session=Depends(database.get_db)):
    return resetPassword.reset_password(request.email,request.otp,request.newPassword,db) 