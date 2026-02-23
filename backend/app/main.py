from fastapi import FastAPI
from .database import engine,SessionLocal
from . import models
from .routers import user, authentication,resetPassword,project,issue
from .admin import create_admin
from .routers import projectMember,analytics
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
models.Base.metadata.create_all(bind=engine)
app.add_middleware(CORSMiddleware,allow_origins=["*"],allow_credentials=True,allow_methods=["*"],allow_headers=["*"])
   
app.include_router(user.router)
app.include_router(authentication.router)
app.include_router(resetPassword.router)
app.include_router(project.router)
app.include_router(projectMember.router)
app.include_router(issue.router)
app.include_router(analytics.router)
@app.on_event("startup")
def admin_user():
    db=SessionLocal()
    create_admin(db)
    db.close()

