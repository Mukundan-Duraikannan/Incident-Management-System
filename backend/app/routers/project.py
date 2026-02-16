from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import database
from ..schemas import ProjectCreate, ProjectUpdate, ProjectResponse
from ..repository import project
from ..oauth2 import admin_only, get_current_user
router=APIRouter(prefix="/projects",tags=["Projects"])

@router.post("/",response_model=ProjectResponse)
def create_project(request:ProjectCreate,db:Session=Depends(database.get_db),admin=Depends(admin_only)):
    return project.create_project(db,request.name,request.description)

@router.get("/",response_model=list[ProjectResponse])
def get_projects(db:Session=Depends(database.get_db),user=Depends(get_current_user)):
    return project.get_projects(db,user)

@router.put("/{id}",response_model=ProjectResponse)
def update_project(id:int,request:ProjectUpdate,db:Session=Depends(database.get_db),admin=Depends(admin_only)):
    return project.update_project(db,id,request.name,request.description)

@router.delete("/{id}")
def delete_project(id:int,db:Session=Depends(database.get_db),admin=Depends(admin_only)):
    return project.delete_project(db,id)            
