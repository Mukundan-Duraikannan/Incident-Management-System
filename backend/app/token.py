from jose import JWTError,jwt
from datetime import datetime,timedelta, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
SecretKey = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
Algorithm = "HS256"
ExpirationTime = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def create_access_token(data: dict):
    encode = data.copy()
    expiration = datetime.now(timezone.utc) + timedelta(minutes=ExpirationTime)
    encode.update({"exp": expiration})
    encodedJwt = jwt.encode(encode, SecretKey, algorithm=Algorithm)
    return encodedJwt

def verify_token(token: str, credentialException):
    try:
        payload = jwt.decode(token,SecretKey,algorithms=[Algorithm])
        email = payload.get("sub")
        if email is None:
            raise credentialException
        return email
    except JWTError:
        raise credentialException
    
def create_reset_token(email: str):
    expireTime = datetime.now(timezone.utc) + timedelta(minutes=10)
    encode = {"sub": email, "exp": expireTime}
    return jwt.encode(encode, SecretKey, algorithm=Algorithm)
    
def verify_reset_token(token:str,credentialException):
    try:
        payload=jwt.decode(token,SecretKey,algorithms=[Algorithm])
        email:str=payload.get("sub")
        if email is None:
            raise credentialException
        return email
    except JWTError:
        raise credentialException
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SecretKey, algorithms=[Algorithm])
        email = payload.get("sub")

        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")

        return email

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
