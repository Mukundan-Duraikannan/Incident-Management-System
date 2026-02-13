from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "postgresql://postgres:siva2004@localhost:5432/incident_db"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def getdb():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


Base = declarative_base()
