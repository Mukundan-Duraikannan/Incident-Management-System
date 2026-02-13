from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import getdb

from models.project import Project
from models.project_member import ProjectMember
from models.user import User
from models.issue import Issue

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/admin/{admin_id}")
def admin_dashboard(admin_id: int, db: Session = Depends(getdb)):

    projects = db.query(Project).filter(admin_id == admin_id).all()

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

        result.append({
            "project_id": project.id,
            "project_name": project.name,
            "team_members": team
        })

    return {
        "admin_id": admin_id,
        "projects": result
    }


@router.get("/manager/{manager_id}")
def manager_dashboard(manager_id: int, db: Session = Depends(getdb)):

    projects = (
        db.query(Project)
        .join(ProjectMember)
        .filter(
            ProjectMember.user_id == manager_id,
            ProjectMember.role.ilike("manager")
        )
        .all()
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
