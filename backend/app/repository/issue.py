from sqlalchemy.orm import Session
from fastapi import HTTPException,status
from .. models import Issue,IssueStatus
def create_issue(db:Session,data,user_id:int):
    issue=Issue(title=data.title,description=data.description,project_id=data.project_id,raised_by=user_id)
    db.add(issue)
    db.commit()
    db.refresh(issue)
    return issue

def get_issue(db:Session,issue_id:int):
    issue=db.query(Issue).filter(Issue.id==issue_id).first()
    if not issue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Issue not found")
    return issue

def assign_issue(db:Session,issue_id:int,user_id:int):
    issue=get_issue(db,issue_id)
    issue.assigned_to=user_id
    issue.status=IssueStatus.Assigned
    db.commit()
    db.refresh(issue)
    return issue

def update_status(db:Session,issue_id:int,status,current_user_id:int):
    issue=get_issue(db,issue_id)
    if issue.assigned_to!=current_user_id:
        raise HTTPException(403,"Only assigned dev can update status")
    issue.status=status
    db.commit()
    db.refresh(issue)
    return issue

def project_issues(db:Session,project_id:int):
    return db.query(Issue).filter(Issue.project_id==project_id).all()

def delete_issue(db:Session,issue_id:int):
    issue=get_issue(db,issue_id)
    db.delete(issue)
    db.commit()