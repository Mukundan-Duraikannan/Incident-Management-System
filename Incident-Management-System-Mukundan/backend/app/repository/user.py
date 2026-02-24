from .. import models, schemas
from ..hashing import Hash

import secrets
from ..mail import registration_mail
from sqlalchemy.orm import Session
from fastapi import HTTPException, status


async def create_user(request: schemas.User, db: Session):
    exist = db.query(models.User).filter(
        models.User.email == request.email).first()
    if exist:
        raise HTTPException(status_code=400, detail="Email already registered")
    temp_pwd = secrets.token_hex(4)
    hashed_pwd = Hash.bcrypt(temp_pwd)
    user = models.User(name=request.name, email=request.email, password=hashed_pwd,
                       role=request.role, isfirstlogin=True, isActive=True)
    db.add(user)
    db.commit()
    db.refresh(user)
    await registration_mail(user.email, temp_pwd)
    return user


def get_allusers(db: Session):
    return (db.query(models.User).filter(models.User.role.ilike("user")).all())


def get_UserbyId(id: int, db: Session):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No User found")
    return user


def update_user(id: int, request: schemas.UpdateUser, db: Session):
    user_query = db.query(models.User).filter(models.User.id == id)
    existing_user = user_query.first()

    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No User found")

    update_data = request.model_dump(exclude_unset=True)
    user_query.update(update_data, synchronize_session=False)
    db.commit()

    return user_query.first()


def delete_user(id: int, db: Session):
    user = db.query(models.User).filter(models.User.id == id)
    if not user.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No User Found")

    new_status = not user.isActive
    user.update({models.User.isActive: new_status})
    db.commit()
