import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", ".env.local", "../.env.local"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    PROJECT_NAME: str = "ByteShift Consulting API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    
    @property
    def async_database_url(self) -> str:
        url = self.DATABASE_URL
        if not url:
            return ""
        # Convert postgres:// or postgresql:// to postgresql+asyncpg://
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgresql://") and not url.startswith("postgresql+asyncpg://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        # asyncpg prefers ssl parameter without mode or query string adjustment
        if "sslmode=require" in url:
            url = url.replace("sslmode=require", "ssl=require")
        return url

    # Security
    JWT_SECRET_KEY: str = os.getenv("AUTH_SECRET") or os.getenv("JWT_SECRET_KEY") or "byteshift-super-secret-key-change-in-production-min-32-chars"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Admin credentials fallback for initial setup
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@byteshift.id")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "admin123")

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

    # S3 / Object Storage (Neon Object Storage / Cloudflare R2 / AWS)
    AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    AWS_BUCKET_NAME: str = os.getenv("AWS_BUCKET_NAME", "")
    AWS_ENDPOINT_URL_S3: str = os.getenv("AWS_ENDPOINT_URL_S3", "")
    PUBLIC_MEDIA_URL_PREFIX: str = os.getenv("NEXT_PUBLIC_MEDIA_URL_PREFIX", "")

settings = Settings()
