"""
JWT authentication middleware for FastAPI
"""

from dotenv import load_dotenv
load_dotenv()

from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
import os


security = HTTPBearer()
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
ALGORITHM = "HS256"
# Disable expiration verification since tokens are created without expiry
JWT_OPTIONS = {"verify_exp": False}


async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
    """
    Verify JWT token from Authorization header.

    Args:
        credentials: HTTP Bearer credentials with JWT token

    Returns:
        dict: Decoded token payload with user_id

    Raises:
        HTTPException: 401 if token is invalid, missing, or expired
    """
    if not SECRET_KEY:
        raise HTTPException(
            status_code=500,
            detail="Server configuration error: BETTER_AUTH_SECRET not set"
        )

    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options=JWT_OPTIONS)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token: missing user_id")
        return {"user_id": user_id}
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
