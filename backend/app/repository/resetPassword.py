from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from .. import models
from ..hashing import Hash
from .. import token
from ..mail import send_reset_mail

async def forgot_password(email:str,db:Session):
    user=db.query(models.User).filter(models.User.email==email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="No User found")
    resetToken=token.create_reset_token(user.email)
    await send_reset_mail(user.email,resetToken)
    return {"message":"Password reset link sent to mail"}

def reset_password(tokenStr:str,newPassword:str,db:Session):
    data=token.verify_token(tokenStr,HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Invalid token"))
    email=data["email"]
    user=db.query(models.User).filter(models.User.email==email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="No User found")
    user.password=Hash.bcrypt(newPassword)
    db.commit()
    db.refresh(user)
    return {"message":"Password reset successful"}
                     


