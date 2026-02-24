from sqlalchemy.orm import Session
from . import models
from .config import settings
from .hashing import Hash
def create_admin(db:Session):
    exists=db.query(models.User).filter(models.User.email==settings.ADMIN_EMAIL).first()
    if exists:
        return 
    admin=models.User(name="Admin",email=settings.ADMIN_EMAIL,password=Hash.bcrypt(settings.ADMIN_PASSWORD),role="admin",isActive=True)
    db.add(admin)
    db.commit()