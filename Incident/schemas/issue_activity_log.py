from pydantic import BaseModel
from datetime import datetime


class IssueActivityLogResponse(BaseModel):
    id: int
    issue_id: int
    action: str
    old_value: str | None
    new_value: str | None
    performed_by: int
    created_at: datetime 

    class Config:
        from_attributes = True
        
    
