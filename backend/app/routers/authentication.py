from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from ..import database, models
from ..hashing import Hash
from sqlalchemy.orm import Session
from ..import token
router = APIRouter(tags=['Authentication'])

@router.post('/login')
def login(request:OAuth2PasswordRequestForm=Depends(),db:Session=Depends(database.get_db)):
    user=db.query(models.User).filter(models.User.email==request.username,models.User.isActive==True).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Invalid credentials")
    if not Hash.verify(user.password,request.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Incorrect pasword")
    if not user.isActive:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="inactive User")
    accessToken=token.create_access_token(data={"user_id":user.id})
    return {"access_token":accessToken,"token_type":"bearer","role":user.role,"email":user.email}

