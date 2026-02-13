from sqlalchemy import Column, Integer, String, Text, Enum, ForeignKey, DateTime
from database import Base
from datetime import datetime
import enum


class IssueStatus(str, enum.Enum):
    Open = "Open"
    Assigned = "Assigned"
    InProgress = "InProgress"
    OnHold = "OnHold"
    Resolved = "Resolved"
    Closed = "Closed"


class Priority(str, enum.Enum):
    Low = "Low"
    Medium = "Medium"
    High = "High"
    Critical = "Critical"


class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    description = Column(Text)

    status = Column(Enum(IssueStatus), default=IssueStatus.Open)
    priority = Column(Enum(Priority), nullable=True)

    project_id = Column(Integer, ForeignKey("projects.id"))
    category_id = Column(Integer, ForeignKey("categories.id"))
    
    raised_by = Column(Integer, ForeignKey("users.id"))
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    handled_by_manager = Column(Integer, ForeignKey("users.id"), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
<<<<<<< HEAD
    closed_at = Column(DateTime,nullable=True)
=======
>>>>>>> f44597da7223eb76200df3cdb77cd29d61304d49
