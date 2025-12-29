"""
Reusable FastAPI CRUD Code Snippets
Copy and adapt these patterns for new resources.
"""

# ============================================================================
# SNIPPET 1: SQLModel Model Definition
# ============================================================================
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class ResourceModel(SQLModel, table=True):
    """
    Template for SQLModel database model.
    Replace 'Resource' with your entity name.
    """
    __tablename__ = "resources"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    name: str = Field(max_length=200, min_length=1)
    description: Optional[str] = Field(default=None, max_length=1000)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ============================================================================
# SNIPPET 2: Pydantic Request/Response Schemas
# ============================================================================
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ResourceCreate(BaseModel):
    """Request schema for creating a resource"""
    name: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)


class ResourceUpdate(BaseModel):
    """Request schema for updating a resource"""
    name: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)


class ResourceResponse(BaseModel):
    """Response schema for resource data"""
    id: int
    user_id: str
    name: str
    description: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ============================================================================
# SNIPPET 3: Service Layer Functions
# ============================================================================
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from typing import List, Optional
from datetime import datetime


async def create_resource(
    session: AsyncSession,
    user_id: str,
    name: str,
    description: Optional[str] = None
) -> ResourceModel:
    """Create a new resource"""
    resource = ResourceModel(user_id=user_id, name=name, description=description)
    session.add(resource)
    await session.commit()
    await session.refresh(resource)
    return resource


async def list_resources(
    session: AsyncSession,
    user_id: str
) -> List[ResourceModel]:
    """List all resources for a user"""
    statement = select(ResourceModel).where(
        ResourceModel.user_id == user_id
    ).order_by(ResourceModel.created_at.desc())
    result = await session.execute(statement)
    return list(result.scalars().all())


async def get_resource(
    session: AsyncSession,
    resource_id: int,
    user_id: str
) -> Optional[ResourceModel]:
    """Get a single resource by ID"""
    statement = select(ResourceModel).where(
        ResourceModel.id == resource_id,
        ResourceModel.user_id == user_id
    )
    result = await session.execute(statement)
    return result.scalar_one_or_none()


async def update_resource(
    session: AsyncSession,
    resource_id: int,
    user_id: str,
    name: str,
    description: Optional[str] = None
) -> Optional[ResourceModel]:
    """Update a resource"""
    resource = await get_resource(session, resource_id, user_id)
    if not resource:
        return None
    resource.name = name
    resource.description = description
    resource.updated_at = datetime.utcnow()
    await session.commit()
    await session.refresh(resource)
    return resource


async def delete_resource(
    session: AsyncSession,
    resource_id: int,
    user_id: str
) -> bool:
    """Delete a resource"""
    resource = await get_resource(session, resource_id, user_id)
    if not resource:
        return False
    await session.delete(resource)
    await session.commit()
    return True


# ============================================================================
# SNIPPET 4: Route Handlers
# ============================================================================
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List

router = APIRouter(prefix="/api/{user_id}/resources", tags=["resources"])


@router.get("", response_model=List[ResourceResponse])
async def list_resources_route(
    user_id: str,
    session: AsyncSession = Depends(get_session),
    auth: dict = Depends(verify_token)
):
    """List all resources for authenticated user"""
    if auth["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    resources = await list_resources(session, user_id)
    return resources


@router.post("", response_model=ResourceResponse, status_code=201)
async def create_resource_route(
    user_id: str,
    data: ResourceCreate,
    session: AsyncSession = Depends(get_session),
    auth: dict = Depends(verify_token)
):
    """Create a new resource"""
    if auth["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    resource = await create_resource(session, user_id, data.name, data.description)
    return resource


@router.get("/{resource_id}", response_model=ResourceResponse)
async def get_resource_route(
    user_id: str,
    resource_id: int,
    session: AsyncSession = Depends(get_session),
    auth: dict = Depends(verify_token)
):
    """Get a single resource"""
    if auth["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    resource = await get_resource(session, resource_id, user_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource


@router.put("/{resource_id}", response_model=ResourceResponse)
async def update_resource_route(
    user_id: str,
    resource_id: int,
    data: ResourceUpdate,
    session: AsyncSession = Depends(get_session),
    auth: dict = Depends(verify_token)
):
    """Update a resource"""
    if auth["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    resource = await update_resource(session, resource_id, user_id, data.name, data.description)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource


@router.delete("/{resource_id}")
async def delete_resource_route(
    user_id: str,
    resource_id: int,
    session: AsyncSession = Depends(get_session),
    auth: dict = Depends(verify_token)
):
    """Delete a resource"""
    if auth["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    success = await delete_resource(session, resource_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Resource not found")
    return {"message": "Resource deleted successfully"}


# ============================================================================
# SNIPPET 5: JWT Authentication Middleware
# ============================================================================
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
import os

security = HTTPBearer()
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
ALGORITHM = "HS256"


async def verify_token(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> dict:
    """Verify JWT token and return user_id"""
    if not SECRET_KEY:
        raise HTTPException(status_code=500, detail="Server configuration error")

    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"user_id": user_id}
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


# ============================================================================
# SNIPPET 6: Database Session Management
# ============================================================================
from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
from sqlalchemy.orm import sessionmaker
import ssl
import os

DATABASE_URL = os.getenv("DATABASE_URL", "")
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

engine: AsyncEngine = create_async_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=300,
    connect_args={"ssl": ssl_context}
)


async def get_session():
    """Dependency injection for database session"""
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        yield session


# ============================================================================
# SNIPPET 7: Global Exception Handler
# ============================================================================
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import logging
import traceback

logger = logging.getLogger(__name__)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Catch all unhandled exceptions.
    Returns generic error to prevent information leakage.
    """
    logger.error(f"Unhandled exception: {exc}")
    logger.error(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )


# ============================================================================
# SNIPPET 8: CORS Configuration
# ============================================================================
from fastapi.middleware.cors import CORSMiddleware

origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
