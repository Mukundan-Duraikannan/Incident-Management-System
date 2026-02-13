from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import getdb
from models.project import Project
from models.user import User
from models.project_member import ProjectMember
from schemas.project_member import MemberCreate, MemberResponse, MemberUpdate

router = APIRouter(prefix="/project-members", tags=["Project Members"])


@router.post("/", response_model=MemberResponse)
def add_member(request: MemberCreate, db: Session = Depends(getdb)):

    project = db.query(Project).filter(
        Project.id == request.project_id).first()
    if not project:
        raise HTTPException(404, "Project not found")

    admin = db.query(User).filter(User.id == request.admin_id).first()
    if not admin:
        raise HTTPException(404, "Admin not found")

    if admin.role != "Admin":
        raise HTTPException(403, "Only admin can add members")
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        raise HTTPException(404, "User not found")

    exists = db.query(ProjectMember).filter(ProjectMember.project_id ==
                                            request.project_id, ProjectMember.user_id == request.user_id).first()

    if exists:
        raise HTTPException(400, "User already pert of this project")

    member = ProjectMember(

        project_id=request.project_id,
        user_id=request.user_id,
        role=request.role,
        admin_id=request.admin_id,
        is_temporary=request.is_temporary
    )

    db.add(member)
    db.commit()
    db.refresh(member)

    user = db.query(User).filter(User.id == request.user_id).first()

    return {
        "id": member.id,
        "project_id": member.project_id,
        "user_id": member.user_id,
        "role": member.role,
        "admin_id": member.admin_id,
        "is_temporary": member.is_temporary
    }


@router.get("/{project_id}", response_model=list[MemberResponse])
def get_members(project_id: int, db: Session = Depends(getdb)):

    results = (
        db.query(ProjectMember, User)
        .join(User, ProjectMember.user_id == User.id)
        .filter(ProjectMember.project_id == project_id)
        .all()
    )

    if not results:
        raise HTTPException(404, "Members not found")

    members = []

    for member, user in results:
        members.append({
            "id": member.id,
            "project_id": member.project_id,
            "user_id": member.user_id,
            "role": member.role,
            "admin_id": member.admin_id,
            "is_temporary": member.is_temporary
        })

    return members


@router.put("/{id}", response_model=MemberResponse)
def update_member(id: int, request: MemberUpdate, db: Session = Depends(getdb)):

    member = db.query(ProjectMember).filter(ProjectMember.id == id).first()

    if not member:
        raise HTTPException(404, "Member not found")

    member.role = request.role
    member.is_temporary = request.is_temporary

    db.commit()
    db.refresh(member)

    user = db.query(User).filter(User.id == member.user_id).first()

    return {
        "id": member.id,
        "project_id": member.project_id,
        "user_id": member.user_id,
        "role": member.role,
        "is_temporary": member.is_temporary
    }


@router.delete("/project/{project_id}")
def delete_members(project_id: int, db: Session = Depends(getdb)):

    members = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id
    ).all()

    if not members:
        raise HTTPException(404, "Members not found")

    for m in members:
        db.delete(m)

    db.commit()
    return {"message": "Members deleted successfully"}
