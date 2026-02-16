from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import func
from app.database import get_db
from app.models.project import Project
from ..oauth2 import get_current_user 
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.models.project import Project
from app.models.project_member import ProjectMember

router = APIRouter(prefix="/projects",tags=["Projects"])
@router.post("/create-project", response_model=ProjectResponse)
def create_project(request: ProjectCreate, db: Session = Depends(get_db)):
    new_project = Project(name=request.name,description=request.description)
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

@router.get("/view")
def view_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()

@router.get("/search/{field}/{value}")
def search_project(field: str, value: str, db: Session = Depends(get_db)):
    field = field.lower()
    value = value.lower()
    if field == "id":
        projects = db.query(Project).filter(Project.id == int(value)).all()
    elif field == "name":
         projects = db.query(Project).filter(func.lower(Project.name).contains(value)).all()
    elif field == "description":
        projects = db.query(Project).filter(func.lower(Project.description).contains(value)).all()
    else:
        raise HTTPException(status_code=400, detail="Invalid search field")
    return projects
@router.delete("/delete/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    db.query(ProjectMember).filter(ProjectMember.project_id == project_id).delete()
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.query(ProjectMember).filter(ProjectMember.project_id == project_id).delete()
    db.delete(project)
    db.commit()
    return {"message": f"Project {project_id} deleted successfully"}
