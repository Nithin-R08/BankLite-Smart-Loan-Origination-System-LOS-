import os
from pydantic_settings import BaseSettings

# Determine if running in a specific environment or load local .env
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
if os.path.exists(env_path):
    from dotenv import load_dotenv
    load_dotenv(env_path)

class Settings(BaseSettings):
    PROJECT_NAME: str = "BankLite Loan Origination System"
    API_V1_STR: str = "/api"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "mysql+pymysql://root:Nithin%402005@localhost:3306/banklite")
    
    # Security
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "banklite-super-secure-secret-key-change-in-prod")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]

    class Config:
        case_sensitive = True

settings = Settings()
