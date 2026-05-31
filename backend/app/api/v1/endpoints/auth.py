import secrets
from urllib.parse import urlencode

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr

from app.core.config import settings
from app.core.security import create_access_token, decode_access_token, hash_password, verify_password
from app.db.session import get_db
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/email/login")


class EmailRegisterIn(BaseModel):
    email: EmailStr
    password: str
    display_name: str


class EmailLoginIn(BaseModel):
    email: EmailStr
    password: str


async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = await db.get(User, payload["sub"])
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


@router.post("/email/register")
async def email_register(payload: EmailRegisterIn, db: AsyncSession = Depends(get_db)) -> dict:
    existing = await db.scalar(select(User).where(User.email == payload.email))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")

    user = User(
        email=payload.email,
        display_name=payload.display_name,
        password_hash=hash_password(payload.password),
        auth_provider="email"
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return {"message": "registered", "email": user.email, "user_id": str(user.id)}


@router.post("/email/login")
async def email_login(payload: EmailLoginIn, db: AsyncSession = Depends(get_db)) -> dict:
    user = await db.scalar(select(User).where(User.email == payload.email))
    if not user or not user.password_hash or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(str(user.id))
    return {"access_token": token, "token_type": "bearer", "email": user.email}


@router.get("/oauth/google/start")
async def oauth_google_start() -> dict:
    state = secrets.token_urlsafe(24)
    query = urlencode(
        {
            "client_id": settings.google_client_id,
            "redirect_uri": f"{settings.api_base_url}/api/v1/auth/oauth/google/callback",
            "response_type": "code",
            "scope": "openid email profile",
            "state": state
        }
    )
    return {"url": f"https://accounts.google.com/o/oauth2/v2/auth?{query}", "state": state}


@router.get("/oauth/github/start")
async def oauth_github_start() -> dict:
    state = secrets.token_urlsafe(24)
    query = urlencode(
        {
            "client_id": settings.github_client_id,
            "redirect_uri": f"{settings.api_base_url}/api/v1/auth/oauth/github/callback",
            "scope": "read:user user:email",
            "state": state
        }
    )
    return {"url": f"https://github.com/login/oauth/authorize?{query}", "state": state}


@router.get("/oauth/google/callback")
async def oauth_google_callback(code: str = Query(...), state: str | None = Query(default=None), db: AsyncSession = Depends(get_db)) -> dict:
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            token_res = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "code": code,
                    "client_id": settings.google_client_id,
                    "client_secret": settings.google_client_secret,
                    "redirect_uri": f"{settings.api_base_url}/api/v1/auth/oauth/google/callback",
                    "grant_type": "authorization_code"
                }
            )
            token_res.raise_for_status()
            token_data = token_res.json()
            access_token = token_data.get("access_token")
            if not access_token:
                raise HTTPException(status_code=400, detail="Google access token missing")

            profile_res = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            profile_res.raise_for_status()
            profile = profile_res.json()
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"Google OAuth upstream error: {exc}") from exc

    email = profile.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Google email missing")

    user = await db.scalar(select(User).where(User.email == email))
    if not user:
        user = User(email=email, display_name=profile.get("name", email.split("@")[0]), auth_provider="google")
        db.add(user)
        await db.commit()
        await db.refresh(user)

    app_token = create_access_token(str(user.id))
    return {"access_token": app_token, "token_type": "bearer", "state": state}


@router.get("/oauth/github/callback")
async def oauth_github_callback(code: str = Query(...), state: str | None = Query(default=None), db: AsyncSession = Depends(get_db)) -> dict:
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            token_res = await client.post(
                "https://github.com/login/oauth/access_token",
                headers={"Accept": "application/json"},
                data={
                    "client_id": settings.github_client_id,
                    "client_secret": settings.github_client_secret,
                    "code": code,
                    "redirect_uri": f"{settings.api_base_url}/api/v1/auth/oauth/github/callback"
                }
            )
            token_res.raise_for_status()
            token_data = token_res.json()
            gh_token = token_data.get("access_token")
            if not gh_token:
                raise HTTPException(status_code=400, detail="GitHub access token missing")

            profile_res = await client.get(
                "https://api.github.com/user",
                headers={"Authorization": f"Bearer {gh_token}", "Accept": "application/vnd.github+json"}
            )
            profile_res.raise_for_status()
            profile = profile_res.json()

            email_res = await client.get(
                "https://api.github.com/user/emails",
                headers={"Authorization": f"Bearer {gh_token}", "Accept": "application/vnd.github+json"}
            )
            email_res.raise_for_status()
            emails = email_res.json()
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"GitHub OAuth upstream error: {exc}") from exc

    primary_email = next((e.get("email") for e in emails if e.get("primary")), None) or (emails[0].get("email") if emails else None)
    if not primary_email:
        raise HTTPException(status_code=400, detail="GitHub email missing")

    user = await db.scalar(select(User).where(User.email == primary_email))
    if not user:
        user = User(email=primary_email, display_name=profile.get("name") or profile.get("login") or "github-user", auth_provider="github")
        db.add(user)
        await db.commit()
        await db.refresh(user)

    app_token = create_access_token(str(user.id))
    return {"access_token": app_token, "token_type": "bearer", "state": state}


@router.get("/me")
async def me(current_user: User = Depends(get_current_user)) -> dict:
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "display_name": current_user.display_name,
        "auth_provider": current_user.auth_provider,
        "xp": current_user.xp,
        "coins": current_user.coins,
        "streak_days": current_user.streak_days
    }
