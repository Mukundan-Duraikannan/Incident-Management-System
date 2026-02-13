from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import getdb
from models.issue import Issue
from models.issue_activity_log import IssueActivityLog
from schemas.issue_activity_log import IssueActivityLogResponse

router = APIRouter(
    prefix="/issue-logs",
    tags=["Issue Activity Logs"]
)

def create_activity_log(
    db: Session,
    issue_id: int,
    action: str,
    old: str | None,
    new: str | None,
    user_id: int
):
    log = IssueActivityLog(
        issue_id=issue_id,
        action=action,
        old_value=old,
        new_value=new,
        performed_by=user_id
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


@router.get("/{issue_id}", response_model=list[IssueActivityLogResponse])
def get_issue_logs(issue_id: int, db: Session = Depends(getdb)):

    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if issue is None:
        raise HTTPException(status_code=404, detail="Issue not found")

    logs = (db.query(IssueActivityLog).filter(IssueActivityLog.issue_id == issue_id).order_by(IssueActivityLog.created_at.asc()).all())

    return logs

