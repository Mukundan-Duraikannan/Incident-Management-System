from sqlalchemy.orm import Session
from ..models import Project
from fastapi import HTTPException,status

def create_project(db:Session,name:str,description:str):
    project=Project(name=name,description=description)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

def get_all_projects(db:Session):
    return db.query(Project).all()

def update_project(db:Session,id:int,name:str,description:str):
    project=db.query(Project).filter(Project.id==id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Project not found")
    project.name=name
    project.description=description
    db.commit()
    db.refresh(project)
    return project

def delete_project(db:Session,id:int):
    project=db.query(Project).filter(Project.id==id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Project not found")
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}
