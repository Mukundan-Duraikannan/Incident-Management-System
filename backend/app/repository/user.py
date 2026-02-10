from .. import models,schemas
from sqlalchemy.orm import Session
from fastapi import HTTPException,status
def create_user(request: schemas.User, db: Session):
    user = models.User(name=request.name,email=request.email,password="")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_allusers(db:Session):
    return db.query(models.User).filter(models.User.isActive==True).all()

def get_UserbyId(id:int,db:Session):
    user=db.query(models.User).filter(models.User.id==id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="No User found")
    return user

def update_user(id:int,request,db:Session):
    user=db.query(models.User).filter(models.User.id==id)
    if not user.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="No User found")
    user.update(request.model_dump(exclude_unset=True))
    db.commit()
    return user.first()

def delete_user(id:int,db:Session):
    user=db.query(models.User).filter(models.User.id==id)
    if not user.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="No User Found")
    user.update({models.User.isActive:False})
    db.commit()
