from sqlalchemy import Column, Integer, String, Text, ForeignKey
from database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    admin_id = Column(Integer, index=True)
    
      
   