import ssl
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from sqlalchemy.pool import NullPool
from backend.app.core.config import settings

Base = declarative_base()

def get_engine_args():
    args = {
        "echo": False,
        "poolclass": NullPool,
    }
    # Neon DB requires SSL
    if "ssl=require" in settings.async_database_url or "sslmode=require" in settings.DATABASE_URL:
        ssl_ctx = ssl.create_default_context()
        ssl_ctx.check_hostname = False
        ssl_ctx.verify_mode = ssl.CERT_NONE
        args["connect_args"] = {"ssl": ssl_ctx}
    return args

# Normalize URL for asyncpg
db_url = settings.async_database_url
# Remove query string parameters that asyncpg doesn't parse natively
if "?" in db_url:
    clean_url = db_url.split("?")[0]
else:
    clean_url = db_url

engine = create_async_engine(clean_url, **get_engine_args()) if clean_url else None
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
) if engine else None

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    if not AsyncSessionLocal:
        raise RuntimeError("DATABASE_URL is not configured.")
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
