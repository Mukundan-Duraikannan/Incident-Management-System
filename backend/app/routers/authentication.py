from fastapi import APIRouter, Depends, HTTPException, status,Form
from fastapi.security import OAuth2PasswordRequestForm
from ..import database, models,schemas
from app.database import get_db
from app.models.user import User
from app.schemas import user as schemas
from ..hashing import Hash
from sqlalchemy import func
from sqlalchemy.orm import Session
from ..import token
router = APIRouter(prefix='/auth',tags=['Authentication'])

@router.post('/login')
def login(username: str = Form(...),password: str = Form(...),role: str = Form(...),db: Session = Depends(database.get_db)):
    user = db.query(User).filter(User.email == username,User.isActive == True).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Invalid username or password")
    if not Hash.verify(user.password, password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Invalid username or password")
    if user.role.lower() != role.lower():
        raise HTTPException(status_code=401, detail="Role does not match")
    accessToken = token.create_access_token(data={"sub": user.email, "role": user.role})
    return {"accessToken": accessToken,"tokenType": "bearer","role": user.role}

@router.get("/view-users")
def view_tickets(db: Session = Depends(get_db)):
    users = db.query(User).filter(User.role=="user").all()
    return users


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(request: schemas.UserCreate, db: Session = Depends(database.get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if user:
        raise HTTPException(status_code=400,detail="User already exists")
    new_user = User(name=request.name,email=request.email,password=Hash.bcrypt(request.password),role=request.role.lower(),isActive=True)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}


