from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from . import token
scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(tokenStr: str = Depends(scheme)):
    credentialException = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Cant validate credentials",headers={"WWW-Authenticate": "Bearer"})
    return token.verify_token(tokenStr, credentialException)
