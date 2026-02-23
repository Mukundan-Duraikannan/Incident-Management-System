from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Project, ProjectMember, Issue
from ..oauth2 import admin_only
from sqlalchemy import func

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/projects")
def project_analytics(db: Session = Depends(get_db), admin=Depends(admin_only)):
    data=(db.query(Project.name,func.count(func.distinct(ProjectMember.user_id)).label("users"),func.count(func.distinct(Issue.id)).label("issues"))
        .outerjoin(ProjectMember, ProjectMember.project_id == Project.id)
        .outerjoin(Issue, Issue.project_id == Project.id)
        .group_by(Project.id, Project.name)
        .all())
    return [{"project": d[0], "users": d[1], "issues": d[2]}
        for d in data]