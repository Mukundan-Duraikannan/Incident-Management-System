from fastapi import HTTPException,Depends,status
from sqlalchemy.orm import Session
from .import database
from .models import ProjectMember
from .oauth2 import get_current_user
def get_project_member(project_id:int,db:Session=Depends(database.get_db),user=Depends(get_current_user)):
    member=db.query(ProjectMember).filter(ProjectMember.project_id==project_id,ProjectMember.user_id==user.id).first()
    if not member:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="You are not in this project")
    return member

def manager_only(member=Depends(get_project_member)):
    if member.role.lower()!="manager":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="Only manager have access")
    
def project_member_only(member=Depends(get_project_member)):
    return member
