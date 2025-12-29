"""
Authentication API route handlers
Implements signup and signin with JWT token generation
"""

import uuid
import hashlib
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from jose import jwt
import os
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select

from db import get_session
from models import User

# JWT configuration
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET", "default-secret-change-in-production")
ALGORITHM = "HS256"
TOKEN_EXPIRE_DAYS = 7

router = APIRouter(prefix="/api/auth", tags=["auth"])


class SignUpRequest(BaseModel):
    """Request model for user signup"""
    email: EmailStr
    password: str  # Min 8 chars, validated on frontend
    name: str | None = None


class SignInRequest(BaseModel):
    """Request model for user signin"""
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    """Response model for successful authentication"""
    token: str
    user: dict


class SignUpResponse(BaseModel):
    """Response model for successful signup"""
    token: str
    user: dict
    message: str = "Account created successfully"


def hash_password(password: str) -> str:
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()


def create_jwt_token(user_id: str, email: str) -> str:
    """Create JWT token with user claims"""
    payload = {
        "sub": user_id,
        "email": email,
        "exp": None  # No expiry for simplicity in this implementation
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/signup", response_model=SignUpResponse)
async def signup(request: SignUpRequest, session: AsyncSession = Depends(get_session)):
    """
    Register a new user account.

    Args:
        request: Email, password, and optional name

    Returns:
        JWT token and user info

    Raises:
        400: Email already registered
    """
    # Check if email already exists
    existing = await session.execute(
        select(User).where(User.email == request.email)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user
    user_id = str(uuid.uuid4())
    new_user = User(
        id=user_id,
        email=request.email,
        name=request.name,
        hashed_password=hash_password(request.password)
    )

    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)

    # Generate JWT token
    token = create_jwt_token(new_user.id, new_user.email)

    return SignUpResponse(
        token=token,
        user={"id": new_user.id, "email": new_user.email, "name": new_user.name}
    )


@router.post("/signin", response_model=AuthResponse)
async def signin(request: SignInRequest, session: AsyncSession = Depends(get_session)):
    """
    Authenticate user and return JWT token.

    Args:
        request: Email and password

    Returns:
        JWT token and user info

    Raises:
        401: Invalid credentials
    """
    # Find user by email
    result = await session.execute(
        select(User).where(User.email == request.email)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Verify password
    if user.hashed_password != hash_password(request.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Generate JWT token
    token = create_jwt_token(user.id, user.email)

    return AuthResponse(
        token=token,
        user={"id": user.id, "email": user.email, "name": user.name}
    )
