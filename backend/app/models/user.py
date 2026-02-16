
from sqlalchemy import Column, Integer, String, Boolean,DateTime
from sqlalchemy.sql import func
from datetime import datetime
from app.database import Base
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    isActive = Column(Boolean, default=True)
    role = Column(String)
    reset_otp = Column(String, nullable=True)
    otp_expiry = Column(DateTime, nullable=True)