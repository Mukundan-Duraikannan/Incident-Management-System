from jose import JWTError,jwt
from datetime import datetime,timedelta, timezone
from .config import settings
from .import models
from sqlalchemy.orm import Session

SecretKey=settings.SecretKey
Algorithm="HS256"
ExpirationTime=30
def create_access_token(data:dict):
    encode=data.copy()
    expiration=datetime.now(timezone.utc)+timedelta(minutes=ExpirationTime)
    encode.update({"exp":expiration})
    encodedJwt=jwt.encode(encode,SecretKey,algorithm=Algorithm)
    return encodedJwt

def verify_token(token: str, credentialException,db:Session):
    try:
        payload=jwt.decode(token,SecretKey,algorithms=[Algorithm])
        user_id:int = payload.get("user_id")
        if user_id is None:
            raise credentialException
        user=db.query(models.User).filter(models.User.id == user_id).first()
        if user is None:
            raise credentialException
        return user
    except JWTError:
        raise credentialException
    
def create_reset_token(email:str):
    expireTime=datetime.now(timezone.utc)+timedelta(minutes=10)
    encode={"sub":email,"exp":expireTime}
    return jwt.encode(encode,SecretKey,algorithm=Algorithm)

def verify_reset_token(token:str,credentialException):
    try:
        payload=jwt.decode(token,SecretKey,algorithms=[Algorithm])
        email:str=payload.get("sub")
        if email is None:
            raise credentialException
        return email
    except JWTError:
        raise credentialException

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SecretKey, algorithm=Algorithm)
