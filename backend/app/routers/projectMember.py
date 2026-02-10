from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import AddMember, MemberResponse,MemberUpdate
from ..repository import projectMember
from ..oauth2 import admin_only
router=APIRouter(prefix="/projects",tags=["Project Members"])
@router.post("/{project_id}/members",response_model=MemberResponse)
def add_project_member(project_id: int,request: AddMember,db: Session = Depends(get_db),admin = Depends(admin_only)):
    return projectMember.add_member(db,project_id,request.user_id,request.role)

@router.get("/{project_id}/members",response_model=list[MemberResponse])
def view_members(project_id:int,db:Session=Depends(get_db),admin=Depends(admin_only)):
    return projectMember.get_project_members(db, project_id)

@router.put("/{project_id}/members")
def update_members(project_id:int,request:MemberUpdate,db:Session=Depends(get_db),admin=Depends(admin_only)):
    return projectMember.update_project_member(db,project_id,request.user_id,request.role)

@router.delete("/{project_id}/members")
def delete_members(project_id:int,user_id:int,db:Session=Depends(get_db),admin=Depends(admin_only)):
    return projectMember.delete_project_member(db,project_id,user_id)