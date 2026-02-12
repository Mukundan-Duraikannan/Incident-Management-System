from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from . import token
from .import database
from sqlalchemy.orm import Session
scheme=OAuth2PasswordBearer(tokenUrl="/login")

def get_current_user(tokenStr:str=Depends(scheme),db:Session=Depends(database.get_db)):
    credentialException=HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Cant validate credentials",headers={"WWW-Authenticate":"Bearer"})
    return token.verify_token(tokenStr,credentialException,db)

def admin_only(user=Depends(get_current_user)):
    if user.role.lower()!="admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Admin access needed")
    return user