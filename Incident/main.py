from fastapi import FastAPI
from models.project import Project
from models.user import User
from models.category import Category
from models.issue import Issue
from router.project_member import router as member_router
from router.issue import router as issue_router
from router.project import router as project_router
from router.user import router as user_router
from router.category import router as category_router
from router.notification import router as notification_router
from router.issue_activity_log import router as issue_activity_log_router
from database import Base, engine
from router.dashboard import router as dashboard_router



app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(issue_router)
app.include_router(member_router)
app.include_router(project_router)
app.include_router(user_router)
app.include_router(category_router)
app.include_router(notification_router)
app.include_router(dashboard_router)
app.include_router(issue_activity_log_router)