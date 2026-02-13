from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import getdb
from datetime import datetime
from models.project import Project
from models.project_member import ProjectMember
from models.user import User
from models.issue import Issue

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/admin/{admin_id}")
def admin_dashboard(admin_id: int, db: Session = Depends(getdb)):

    projects = db.query(Project).filter(Project.admin_id == admin_id).all()

    result = []

    for project in projects:

        members = ( db.query(ProjectMember, User).join(User, User.id == ProjectMember.user_id).filter(ProjectMember.project_id == project.id).all())

        team = []

        for member, user in members:
            team.append({
                "user_id": user.id,
                "name": user.name,
                "role": member.role
            })
            
        issues = db.query(Issue).filter(Issue.project_id==project.id).all()
        issue_data=[]
        
        for issue in issues:
            raised_user = db.query(User).filter(User.id==issue.raised_by).first()
            assigned_user = db.query(User).filter(User.id==issue.assigned_to).first() if issue.assigned_to else None
            manager_user = db.query(User).filter(User.id==issue.handled_by_manager).first() if issue.handled_by_manager else None
            
            resolution_time = None
            
            if issue.closed_at:
               
                resolution_time = issue.closed_at - issue.created_at
                
            issue_data.append({
                "issue_id":issue.id,
                "title":issue.title,
                "description":issue.description,
                "status":issue.status.value if issue.status else None,
                "priority":issue.priority,
                "raised_by":{
                  "id":raised_user.id if raised_user else None,
                  "name":raised_user.name if raised_user else None,
                 },
                "assigned_to":{
                   "id":assigned_user.id if assigned_user else None,
                  "name":assigned_user.name if assigned_user else None
                },
               "handled_by_manager":{
                  "id":manager_user.id if manager_user else None,
                  "name":manager_user.name if manager_user else None
                },
                "created_at" :issue.created_at,
                "closed_at": issue.closed_at,
                "resolution_time":str(resolution_time) if resolution_time else None
            })
        result.append({
            "project_id": project.id,
            "project_name": project.name,
            "team_members": team,
             "issues":issue_data
        })

    return {
        "admin_id": admin_id,
        "projects": result
    }


@router.get("/manager/{manager_id}")
def manager_dashboard(manager_id: int, db: Session = Depends(getdb)):

    projects = (db.query(Project).join(ProjectMember).filter(ProjectMember.user_id == manager_id,ProjectMember.role.ilike("manager")
        ).all()
    )

    data = []

    for project in projects:

        members = (db.query(ProjectMember, User).join(User, User.id == ProjectMember.user_id).filter(ProjectMember.project_id == project.id).all())

        issues = db.query(Issue).filter( Issue.project_id == project.id).all()

        data.append({
            "project_id": project.id,
            "project_name": project.name,

            "team_members": [
                {
                    "id": user.id,
                    "name": user.name,
                    "role": member.role
                }
                for member, user in members
            ],

            "issues": [
                {
                    "id": issue.id,
                    "title": issue.title,
                    "status": issue.status,
                    "assigned_to": issue.assigned_to,
                    "priority": issue.priority
                }
                for issue in issues
            ]
        })

    return {
        "manager_id": manager_id,
        "projects": data
    }


@router.get("/developer/{developer_id}")
def developer_dashboard(developer_id: int, db: Session = Depends(getdb)):

    projects = (
        db.query(Project)
        .join(ProjectMember)
        .filter(ProjectMember.user_id == developer_id)
        .all()
    )

    assigned_issues = db.query(Issue).filter(Issue.assigned_to == developer_id).all()

    return {
        "developer_id": developer_id,

        "projects": [
            {
                "id": project.id,
                "name": project.name
            }
            for project in projects
        ],

        "working_on": [
            {
                "id": issue.id,
                "title": issue.title,
                "status": issue.status,
                "priority": issue.priority
            }
            for issue in assigned_issues
        ]
    }
