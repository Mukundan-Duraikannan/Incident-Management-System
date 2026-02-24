from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class IssueActivityLog(Base):
    __tablename__ = "issue_activity_logs"

    id = Column(Integer, primary_key=True, index=True)

    issue_id = Column(Integer, ForeignKey("issues.id"))

    action = Column(String(255))
    old_value = Column(String, nullable=True)
    new_value = Column(String, nullable=True)
    performed_by = Column(Integer)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    
    issue = relationship("Issue", backref="activity_logs")
