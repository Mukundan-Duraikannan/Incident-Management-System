from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
import os

conf = ConnectionConfig(
    MAIL_USERNAME="your_email@gmail.com",
    MAIL_PASSWORD="your_app_password",
    MAIL_FROM="your_email@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)

async def send_reset_mail(email: EmailStr, otp: str):
    message = MessageSchema(
        subject="Password Reset OTP",
        recipients=[email],
        body=f"""
        Your OTP for password reset is: {otp}
        It will expire in 5 minutes.
        """,
        subtype="plain"
    )

    fm = FastMail(conf)
    await fm.send_message(message)
