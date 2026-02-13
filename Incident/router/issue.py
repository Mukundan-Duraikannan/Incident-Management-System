from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import getdb
<<<<<<< HEAD
from datetime import datetime
=======
>>>>>>> f44597da7223eb76200df3cdb77cd29d61304d49
from models.notification import Notification
from models.issue import Issue, IssueStatus
from models.issue_activity_log import IssueActivityLog
from schemas.issue import IssueCreate, IssueAssign, IssueStatusUpdate, IssueResponse
from models.project_member import ProjectMember

router = APIRouter(prefix="/issues", tags=["Issues"])

def create_activity_log(db:Session,issue_id:int,action:str,old:str|None,new:str|None,user_id:int):
 log = IssueActivityLog(issue_id=issue_id,action=action,old_value=old,new_value=new,performed_by=user_id)
 db.add(log)
 db.commit()
 db.refresh(log)
 return log

@router.post("/", response_model=IssueResponse)
def raise_issue(request: IssueCreate, db: Session = Depends(getdb)):
    member = db.query(ProjectMember).filter(ProjectMember.project_id ==request.project_id, ProjectMember.user_id == request.raised_by).first()

    if not member:
        raise HTTPException(
            status_code=403, detail="User does not belong to this project")

    issue = Issue(
        title=request.title,
        description=request.description,
        category_id=request.category_id,
        project_id=request.project_id,
        raised_by=request.raised_by,
        priority=None,
        status=IssueStatus.Open
    )
    db.add(issue)
    db.commit()
    db.refresh(issue)
    
    create_activity_log(db=db,issue_id=issue.id,action="Issue Created",old=None,new="Open",user_id=request.raised_by)

    managers = db.query(ProjectMember).filter(ProjectMember.project_id ==
                                              request.project_id, ProjectMember.role.ilike("manager")).all()

    for m in managers:
        notification = Notification(user_id=m.user_id, message=f"New issue raised{request.project_id}:{issue.title}")
        db.add(notification)

    db.commit()

    return issue


@router.get("/{issue_id}", response_model=IssueResponse)
def get_issue(issue_id: int, db: Session = Depends(getdb)):

    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(404, "Issue not found")

    return issue


@router.put("/{issue_id}/assign")
def assign_issue(issue_id: int, request: IssueAssign, db: Session = Depends(getdb)):

    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    manager = db.query(ProjectMember).filter(
        ProjectMember.project_id == issue.project_id,
        ProjectMember.user_id == request.manager_id,
        ProjectMember.role.ilike("manager")
    ).first()

    if not manager:
        raise HTTPException(
            status_code=403, detail="Only Manager of this project can assign issue")

    developer = db.query(ProjectMember).filter(
        ProjectMember.project_id == issue.project_id,
        ProjectMember.user_id == request.user_id,
    ).first()

    if not developer:
        raise HTTPException(status_code=404, detail="Developer not part of this project")

    if request.user_id == issue.raised_by:
        raise HTTPException(status_code=400, detail="Issue cannot be assigned to the user who raised it")

    old_assigned = issue.assigned_to
    issue.assigned_to = request.user_id
    issue.priority = request.priority
    issue.status = IssueStatus.Assigned
    issue.handled_by_manager = request.manager_id

    db.commit()
    db.refresh(issue)
    
    create_activity_log(db=db,issue_id=issue.id,action="Issue Assigned",old=str(old_assigned),new=str(request.user_id),user_id=request.manager_id)

    return {
        "message": "Issue assigned successfully",
        "issue_id": issue.id,
        "assigned_to": issue.assigned_to,
        "priority": issue.priority,
        "manager_id": issue.handled_by_manager
    }


@router.put("/{issue_id}/status", response_model=IssueResponse)
def update_status(issue_id: int, request: IssueStatusUpdate, db: Session = Depends(getdb)):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(404, "Issue not found")

    if issue.assigned_to != request.user_id:
        raise HTTPException(
            status_code=403, detail="Only assigned developer can update the status")
    if issue.status == request.user_id:
        raise HTTPException(status_code=403,detail="Only assigned developer can update status")
    
    old_status = issue.status
    issue.status = request.status
<<<<<<< HEAD
    
    if request.status == IssueStatus.Closed:
        issue.closed_at = datetime.utcnow()
=======
>>>>>>> f44597da7223eb76200df3cdb77cd29d61304d49

    db.commit()
    db.refresh(issue)
    
    create_activity_log(db=db,issue_id=issue.id,action="Status Updated",old=old_status.value if old_status else None,new=request.status.value if request.status else None,user_id=request.user_id)

    return issue


@router.get("/project/{project_id}", response_model=list[IssueResponse])
def project_issues(project_id: int, db: Session = Depends(getdb)):

    return db.query(Issue).filter(Issue.project_id == project_id).all()


@router.delete("/{issue_id}")
def delete_issue(issue_id: int, db: Session = Depends(getdb)):

    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(404, "Issue not found")
    create_activity_log(db=db,issue_id=issue.id,action="Issue Deleted",old=str(issue.status),new=None,user_id=issue.raised_by)
    db.delete(issue)
    db.commit()

    return {"message": "Issue deleted successfully"}
