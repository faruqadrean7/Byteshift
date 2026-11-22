from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.app.db.session import get_db
from backend.app.core.config import settings
from backend.app.core.security import (
    verify_password,
    create_access_token,
    get_current_user,
    hash_password,
)
from backend.app.models.entities import Profile
from backend.app.schemas.schemas import LoginRequest, TokenResponse

router = APIRouter()

@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest, db: AsyncSession = Depends(get_db)):
    email = credentials.email.strip().lower()
    password = credentials.password

    # 1. Environment credentials fallback (same logic as Next.js auth)
    env_admin_email = settings.ADMIN_EMAIL.strip().lower()
    env_admin_password = settings.ADMIN_PASSWORD

    if env_admin_password and email == env_admin_email and password == env_admin_password:
        user_info = {
            "id": "admin-root",
            "email": env_admin_email,
            "role": "admin",
            "full_name": "Root Administrator",
        }
        token = create_access_token(user_info)
        return TokenResponse(access_token=token, token_type="bearer", user=user_info)

    # 2. Database profiles lookup
    stmt = select(Profile).where(Profile.email == email)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau kata sandi tidak cocok.",
        )

    if not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau kata sandi tidak cocok.",
        )

    user_info = {
        "id": str(user.id),
        "email": user.email,
        "role": user.role,
        "full_name": user.full_name,
        "avatar_url": user.avatar_url,
    }
    token = create_access_token(user_info)
    return TokenResponse(access_token=token, token_type="bearer", user=user_info)

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user
