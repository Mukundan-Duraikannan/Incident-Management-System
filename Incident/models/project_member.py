from sqlalchemy import Column, Integer, Boolean, ForeignKey, String
from sqlalchemy.orm import relationship
from database import Base


class ProjectMember(Base):
    __tablename__ = "project_members"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    admin_id = Column(Integer, index=True)
    role = Column(String)
    is_temporary = Column(Boolean, default=False)

    user = relationship("User")
    project = relationship("Project")
