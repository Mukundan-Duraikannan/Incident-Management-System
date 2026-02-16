
from sqlalchemy import Column, Integer, String, Boolean,Date
from sqlalchemy.sql import func
from app.database import Base
class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False)
    project_title = Column(String, nullable=False)
    issue = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, nullable=False)
    status = Column(String, default="created")
    created_at = Column(
        Date,
        server_default=func.current_date()
    )

