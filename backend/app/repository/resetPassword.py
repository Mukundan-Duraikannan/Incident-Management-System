from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from .. import models
from ..hashing import Hash
from ..mail import send_reset_mail
from datetime import datetime, timedelta
import random

async def forgot_password(email: str, db: Session):
    user = db.query(models.User).filter(models.User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user found with this email"
        )

    otp = str(random.randint(100000, 999999))
    hashed_otp = Hash.bcrypt(otp)

    user.reset_otp = hashed_otp
    user.otp_expiry = datetime.utcnow() + timedelta(minutes=5)

    db.commit()

    await send_reset_mail(user.email, otp)

    return {"message": "OTP sent to email successfully"}


def reset_password(email: str, otp: str, newPassword: str, db: Session):
    user = db.query(models.User).filter(models.User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user found"
        )

    if not user.reset_otp:
        raise HTTPException(status_code=400, detail="No OTP requested")

    if user.otp_expiry < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP expired")

    if not Hash.verify(user.reset_otp, otp):
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user.password = Hash.bcrypt(newPassword)
    user.reset_otp = None
    user.otp_expiry = None

    db.commit()

    return {"message": "Password reset successful"}
