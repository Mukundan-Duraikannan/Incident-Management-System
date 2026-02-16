from fastapi import FastAPI
from .database import engine
from app.models import user,ticket as models
from app.models import project as project_model
from .routers import user, authentication,resetPassword,ticket,project,project_member,resetPassword
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


models.Base.metadata.create_all(bind=engine)

app.include_router(user.router)
app.include_router(authentication.router)
app.include_router(resetPassword.router)
app.include_router(ticket.router)
app.include_router(project.router)
app.include_router(project_member.router)
app.include_router(resetPassword.router)