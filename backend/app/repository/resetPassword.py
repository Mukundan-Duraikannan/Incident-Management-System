from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from .. import models
from ..hashing import Hash
from ..mail import send_reset_mail
from datetime import datetime,timedelta
import random
async def forgot_password(email:str,db:Session):
    user=db.query(models.User).filter(models.User.email==email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="No User found")
    otp=str(random.randint(100000,999999))
    hashedotp=Hash.bcrypt(otp)
    user.reset_otp=hashedotp 
    user.otp_expiry=datetime.utcnow()+timedelta(minutes=5)
    db.commit()
    await send_reset_mail(user.email,otp)
    return {"message":"OTP sent to mail"}

def reset_password(email:str,otp:str,newPassword:str,db:Session):
    user=db.query(models.User).filter(models.User.email==email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="No User found")
    if not Hash.verify(user.reset_otp,otp):
        raise HTTPException(status_code=400,detail="Invald OTP")
    if user.otp_expiry<datetime.utcnow():
        raise HTTPException(status_code=400,detail="OTP expired") 
    user.password=Hash.bcrypt(newPassword)
    db.commit()
    db.refresh(user)
    return {"message":"Password reset successful"}
                     


