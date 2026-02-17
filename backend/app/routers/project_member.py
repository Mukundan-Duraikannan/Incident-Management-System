from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from sqlalchemy import func
from typing import List
from app.models.project_member import ProjectMember
from app.schemas.project_member import ProjectMemberCreate, ProjectMemberResponse
from app.models.user import User
from app.models.project import Project
router = APIRouter(prefix="/project-members", tags=["Project Members"])
@router.post("/member", response_model=list[ProjectMemberResponse])
def add_members(data: ProjectMemberCreate, db: Session = Depends(get_db)):
    created_members = []
    for item in data.members:
        new_member = ProjectMember(
            project_id=data.project_id,
            user_id=item.user_id,
            role=item.role
        )
        db.add(new_member)
        created_members.append(new_member)
    db.commit()
    for member in created_members:
        db.refresh(member)
    return created_members
@router.get("/view")
def view_project_members(db: Session = Depends(get_db)):
    members = (
        db.query(Project)
        .all()
    )
    return members
@router.get("/search/{field}/{value}")
def search_project_members(field: str, value: str, db: Session = Depends(get_db)):
    field = field.lower()
    value = value.lower()
    query = (db.query(Project.id.label("project_id"),Project.name.label("project_name"),).join(Project, ProjectMember.project_id == Project.id))
    if field == "project":
        query = query.filter(func.lower(Project.name).contains(value))
    elif field == "id":
        query = query.filter(func.lower(Project.id).contains(value))
    else:
        raise HTTPException(status_code=400, detail="Invalid search field")
    results = query.all()
    return [{"Project id": r.project_id,"Project name": r.project_name,}for r in results]
@router.get("/{project_id}")
@router.get("/project-members/{project_id}")
def get_project_members(project_id: int, db: Session = Depends(get_db)):
    members = (
        db.query(ProjectMember)
        .join(User)
        .filter(ProjectMember.project_id == project_id)
        .all()
    )

    return [
        {
            "user_id": m.user.id,
            "username": m.user.name,
            "role": m.role,
            "isActive": m.user.isActive   # ✅ comes from User table
        }
        for m in members
    ]

@router.put("/update/{project_id}/{user_id}", response_model=ProjectMemberResponse)
def update_project_member_role(project_id: int,user_id: int,role: str,db: Session = Depends(get_db)):
    member = (db.query(ProjectMember).filter(ProjectMember.project_id == project_id, ProjectMember.user_id == user_id).first())
    if not member:
        raise HTTPException(status_code=404, detail="Project member not found")
    member.role = role
    db.commit()
    db.refresh(member)
    return member
@router.delete("/delete/{project_id}/{user_id}")
def delete_project_member(project_id: int, user_id: int, db: Session = Depends(get_db)):
    member = (db.query(ProjectMember).filter(ProjectMember.project_id == project_id, ProjectMember.user_id == user_id).first())
    if not member:
        raise HTTPException(status_code=404, detail="Project member not found")
    db.delete(member)
    db.commit()
    return {"message": f"User {user_id} removed from project {project_id} successfully"}