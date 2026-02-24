from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL:str
    SecretKey:str
    ADMIN_EMAIL:str
    ADMIN_PASSWORD:str
    MAIL_USERNAME:str
    MAIL_PASSWORD:str
    class Config:
        env_file=".env"

settings=Settings()
