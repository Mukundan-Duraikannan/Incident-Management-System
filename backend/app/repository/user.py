
from sqlalchemy.orm import Session
from ..hashing import Hash
from sqlalchemy import func
from fastapi import HTTPException,status,Depends
from app.schemas import user as schemas
from app.models.user import User
from .. import database
def create_user(request: schemas.User, db: Session):
    user = models.User(name=request.name,email=request.email,password=Hash.bcrypt(request.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def search_users(field: str, value: str, db: Session = Depends(database.get_db)):

    field = field.lower()
    value = value.lower()

    if field == "id":
        users = db.query(User).filter(User.id == int(value)).all()

    elif field == "name":
        users = db.query(User).filter(
            func.lower(User.name).contains(value)
        ).all()

    elif field == "email":
        users = db.query(User).filter(
            func.lower(User.email).contains(value)
        ).all()

    elif field == "role":
        users = db.query(User).filter(
            func.lower(User.role).contains(value)
        ).all()

    else:
        raise HTTPException(status_code=400, detail="Invalid search field")

    return users

