from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import getdb
from models.user import User
from models.project import Project
from schemas.user import UserCreate, UserResponse
from schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post("/", response_model=ProjectResponse)
def create_project(request: ProjectCreate, db: Session = Depends(getdb)):
    user = db.query(User).filter(User.id == request.admin_id).first()

    if user.role != "Admin":
        raise HTTPException(403, "Only admin can create project")

    project = Project(**request.dict())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get("/", response_model=list[ProjectResponse])
def get_projects(db: Session = Depends(getdb)):
    return db.query(Project).all()


@router.put("/{id}", response_model=ProjectResponse)
def update_project(id: int, request: ProjectUpdate, db: Session = Depends(getdb)):
    project = db.query(Project).filter(Project.id == id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project.name = request.name
    project.description = request.description

    db.commit()
    db.refresh(project)
    return project


@router.delete("/{id}")
def delete_project(id: int, db: Session = Depends(getdb)):
    project = db.query(Project).filter(Project.id == id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}
