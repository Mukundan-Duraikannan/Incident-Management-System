from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from . import token
from .import database
from sqlalchemy.orm import Session
from .models import ProjectMember
scheme=OAuth2PasswordBearer(tokenUrl="/login")

def get_current_user(tokenStr:str=Depends(scheme),db:Session=Depends(database.get_db)):
    credentialException=HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Cant validate credentials",headers={"WWW-Authenticate":"Bearer"})
    return token.verify_token(tokenStr,credentialException,db)

def admin_only(user=Depends(get_current_user)):
    if user.role.lower()!="admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Admin access needed")
    return user

def project_member_only(project_id: int,db:Session=Depends(database.get_db),user=Depends(get_current_user)):
    if user.role=="admin":
        return user
    member=db.query(ProjectMember).filter(ProjectMember.project_id==project_id,ProjectMember.user_id==user.id).first()
    if not member:
        raise HTTPException(status_code=403, detail="Not a project member")
    return user
