from fastapi_mail import FastMail,ConnectionConfig,MessageSchema
from .config import settings
conf=ConnectionConfig(MAIL_USERNAME=settings.ADMIN_EMAIL,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.ADMIN_EMAIL,
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True)

async def send_reset_mail(email:str,otp:str):
    msg=MessageSchema(subject="Reset password",recipients=[email],
    body=f"Hi,Here is the OTP to reset password {otp}.This otp expires in 10 minutes."
    f"Change password here: http://localhost:5173/reset-password",subtype="plain")
    fastMail=FastMail(conf)
    await fastMail.send_message(msg)