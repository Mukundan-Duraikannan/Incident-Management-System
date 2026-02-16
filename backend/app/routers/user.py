from fastapi import APIRouter, Depends,HTTPException
from ..import database, schemas
from sqlalchemy.orm import Session
from ..repository import user
from typing import List
from sqlalchemy import func
from app.database import get_db
from app.models.user import User
from app.schemas import user as schemas
router = APIRouter(prefix='/user', tags=['Users'])

@router.get("/search/{field}/{value}")
def get_UsersById(field:str,value:str, db: Session = Depends(database.get_db)):
    return user.search_users(field,value,db)

@router.put('/{id}')
def update_user(id: int, request: schemas.User, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.name = request.name
    user.email = request.email
    user.role = request.role

    db.commit()
    db.refresh(user)

    return {"message": "User updated successfully"}

@router.delete("/delete/{id}")
def disable_user(id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.isActive = False  
    db.commit()

    return {"message": "User disabled successfully"}

    
