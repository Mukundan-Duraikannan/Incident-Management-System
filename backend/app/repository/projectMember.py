from sqlalchemy.orm import Session,joinedload
from fastapi import HTTPException,status
from ..models import ProjectMember,User,Project

def add_member(db:Session,project_id:int,user_id:int,role:str):
    project=db.query(Project).filter(Project.id==project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Project not found")
    user=db.query(User).filter(User.id==user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="User not found")
    member=ProjectMember(project_id=project_id,user_id=user_id,role=role.lower())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member 

def get_project_members(db:Session,project_id:int): 
    members=(db.query(ProjectMember).options(joinedload(ProjectMember.user)).filter(ProjectMember.project_id==project_id).all())
    return [
    {"user_id":m.user_id,"name":m.user.name,"role":m.role}
        for m in members]

def update_project_member(db:Session,project_id:int,user_id:int,role:str):
    member=db.query(ProjectMember).filter(ProjectMember.project_id==project_id,ProjectMember.user_id==user_id).first()
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Member not found in this project")
    member.role=role
    db.commit()
    db.refresh(member)
    return member

def delete_project_member(db:Session, project_id: int, user_id: int):
    member=db.query(ProjectMember).filter(ProjectMember.project_id==project_id,ProjectMember.user_id==user_id).first()
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Member not found in this project")
    db.delete(member)
    db.commit()
    return {"message":"Member removed from project"}