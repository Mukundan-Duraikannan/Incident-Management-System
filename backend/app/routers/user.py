from fastapi import APIRouter, Depends
from ..import database, schemas
from sqlalchemy.orm import Session
from ..repository import user,resetPassword
from ..oauth2 import admin_only, get_current_user
from typing import List
router=APIRouter(prefix='/user',tags=['Users'])

@router.post("/",response_model=schemas.ShowUser)
async def create_user(request:schemas.User,db:Session=Depends(database.get_db),admin=Depends(admin_only)):
    users=user.create_user(request,db)
    await resetPassword.forgot_password(users.email,db)
    return users

@router.get("/",response_model=List[schemas.ShowUser])
def get_users(db:Session=Depends(database.get_db),admin=Depends(admin_only)):
    return user.get_allusers(db)

@router.get("/{id}",response_model=schemas.ShowUser)
def get_UsersById(id:int,db:Session=Depends(database.get_db),admin=Depends(admin_only)):
    return user.get_UserbyId(id,db)

@router.put("/{id}",response_model=schemas.ShowUser)
def update_user(id:int,request:schemas.UpdateUser,db:Session=Depends(database.get_db),admin=Depends(admin_only)):
    return user.update_user(id,request,db)

@router.delete("/{id}")
def delete_user(id:int,db:Session=Depends(database.get_db),admin=Depends(admin_only)):
    user.delete_user(id,db)
    return {"message":"User deactivated"}
