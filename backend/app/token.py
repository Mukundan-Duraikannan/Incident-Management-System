from jose import JWTError,jwt
from datetime import datetime,timedelta, timezone
from .config import settings

SecretKey=settings.SecretKey
Algorithm="HS256"
ExpirationTime=30
def create_access_token(data:dict):
    encode=data.copy()
    expiration=datetime.now(timezone.utc)+timedelta(minutes=ExpirationTime)
    encode.update({"exp":expiration})
    encodedJwt=jwt.encode(encode,SecretKey,algorithm=Algorithm)
    return encodedJwt

def verify_token(token: str, credentialException):
    try:
        payload=jwt.decode(token,SecretKey,algorithms=[Algorithm])
        email=payload.get("sub")
        role=payload.get("role")
        if email is None:
            raise credentialException
        return {"email":email,"role":role}
    except JWTError:
        raise credentialException
    
def create_reset_token(email:str):
    expireTime=datetime.now(timezone.utc)+timedelta(minutes=10)
    encode={"sub":email,"exp":expireTime}
    return jwt.encode(encode,SecretKey,algorithm=Algorithm)


