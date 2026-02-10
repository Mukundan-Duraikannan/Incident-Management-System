from .database import Base
from sqlalchemy import Column,Integer,String,Boolean,Text,ForeignKey

class User(Base):
    __tablename__="users"

    id=Column(Integer,primary_key=True,index=True)
    name=Column(String)
    email=Column(String,unique=True)
    password=Column(String)
    isActive=Column(Boolean,default=True)
    role=Column(String,default="user")


class Project(Base):
    __tablename__ = "projects"
 
    id=Column(Integer,primary_key=True,index=True)
    name=Column(String,nullable=False)
    description=Column(Text)

##update
class ProjectMember(Base):
    __tablename__="project_members"

    id=Column(Integer,primary_key=True,index=True)
    project_id=Column(Integer,ForeignKey("projects.id"))
    user_id=Column(Integer,ForeignKey("users.id"))
    role=Column(String)
