from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..issue import IssueCreate, IssueAssign, IssueStatusUpdate, IssueResponse
from ..repository import issue 
from .. import issue as Issue
from ..oauth2 import get_current_user,admin_only
from ..projectAccess import manager_only,project_member_only
router = APIRouter(prefix="/issues", tags=["Issues"])

@router.post("/project/{project_id}", response_model=IssueResponse)
def raise_issue(project_id:int,request:IssueCreate,db:Session=Depends(get_db),access=Depends(project_member_only),user=Depends(get_current_user)):
    return issue.create_issue(db,request,project_id,user.id)

@router.get("/",response_model=list[IssueResponse])
def get_all_issues(db:Session=Depends(get_db),user=Depends(get_current_user),admin=Depends(admin_only)):
    return issue.get_all_issues(db)

@router.get("/{issue_id}",response_model=IssueResponse)
def get_issue(issue_id:int,db: Session = Depends(get_db),access = Depends(project_member_only)):
    return issue.get_issue(db, issue_id)

@router.put("/{issue_id}/assign", response_model=IssueResponse)
def assign_issue(issue_id:int,request:IssueAssign,db:Session=Depends(get_db),access=Depends(manager_only)):
    return issue.assign_issue(db,issue_id,request.user_id,request.priority)

@router.put("/{issue_id}/status",response_model=IssueResponse)
def update_status(issue_id:int,request:IssueStatusUpdate,db:Session=Depends(get_db),access=Depends(project_member_only),user=Depends(get_current_user)):
    return issue.update_status(db, issue_id, request.status, user.id)

@router.get("/project/{project_id}",response_model=list[IssueResponse])
def project_issues(project_id:int,db:Session=Depends(get_db),access=Depends(project_member_only)):
    return issue.project_issues(db, project_id)

@router.delete("/{issue_id}")
def delete_issue(issue_id:int,db:Session=Depends(get_db),access=Depends(manager_only)):
    issue.delete_issue(db, issue_id)
    return {"message": "Issue deleted"}

@router.get("/assigned/me",response_model=List[IssueResponse])
def get_assigned_issues(db:Session=Depends(get_db),user=Depends(get_current_user)):
    return issue.get_assigned_issues(db,user.id)