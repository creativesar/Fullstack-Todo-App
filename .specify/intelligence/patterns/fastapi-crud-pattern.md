# FastAPI CRUD Pattern

**Category:** Backend API Pattern
**Stack:** FastAPI + SQLModel + asyncpg
**Reusability:** High - Applicable to any RESTful CRUD API

## Overview

A complete, reusable pattern for implementing CRUD (Create, Read, Update, Delete) operations in FastAPI with proper authentication, authorization, and separation of concerns.

## Architecture Layers

```
routes/          # HTTP endpoint handlers
├── tasks.py     # Route definitions with dependency injection
schemas/         # Pydantic models for validation
├── task.py      # Request/Response models
services/        # Business logic layer
├── task_service.py  # CRUD operations
middleware/      # Cross-cutting concerns
├── auth.py      # JWT verification
models.py        # SQLModel database models
db.py            # Database connection management
```

## Pattern Implementation

### 1. SQLModel Model Definition

```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class Task(SQLModel, table=True):
    """
    SQLModel representation - serves as both ORM model and Pydantic model.
    """
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=200, min_length=1)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### 2. Pydantic Request/Response Schemas

```python
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TaskCreate(BaseModel):
    """Request schema for creating a task"""
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)

class TaskUpdate(BaseModel):
    """Request schema for updating a task"""
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)

class TaskResponse(BaseModel):
    """Response schema for task data"""
    id: int
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
```

### 3. Service Layer Functions

```python
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from typing import List, Optional
from datetime import datetime

async def create_task(
    session: AsyncSession,
    user_id: str,
    title: str,
    description: Optional[str] = None
) -> Task:
    task = Task(user_id=user_id, title=title, description=description)
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task

async def list_tasks(session: AsyncSession, user_id: str) -> List[Task]:
    statement = select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc())
    result = await session.execute(statement)
    return list(result.scalars().all())

async def get_task(session: AsyncSession, task_id: int, user_id: str) -> Optional[Task]:
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(statement)
    return result.scalar_one_or_none()

async def update_task(
    session: AsyncSession,
    task_id: int,
    user_id: str,
    title: str,
    description: Optional[str] = None
) -> Optional[Task]:
    task = await get_task(session, task_id, user_id)
    if not task:
        return None
    task.title = title
    task.description = description
    task.updated_at = datetime.utcnow()
    await session.commit()
    await session.refresh(task)
    return task

async def delete_task(session: AsyncSession, task_id: int, user_id: str) -> bool:
    task = await get_task(session, task_id, user_id)
    if not task:
        return False
    await session.delete(task)
    await session.commit()
    return True

async def toggle_completion(session: AsyncSession, task_id: int, user_id: str) -> Optional[Task]:
    task = await get_task(session, task_id, user_id)
    if not task:
        return None
    task.completed = not task.completed
    task.updated_at = datetime.utcnow()
    await session.commit()
    await session.refresh(task)
    return task
```

### 4. Route Handlers with Authorization

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List

router = APIRouter(prefix="/api/{user_id}/tasks", tags=["tasks"])

@router.get("", response_model=List[TaskResponse])
async def list_tasks(
    user_id: str,
    session: AsyncSession = Depends(get_session),
    auth: dict = Depends(verify_token)
):
    # Authorization: Verify user owns the resource
    if auth["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Forbidden: Cannot access other user's tasks")

    tasks = await task_service.list_tasks(session, user_id)
    return tasks

@router.post("", response_model=TaskResponse, status_code=201)
async def create_task(
    user_id: str,
    task_data: TaskCreate,
    session: AsyncSession = Depends(get_session),
    auth: dict = Depends(verify_token)
):
    if auth["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    task = await task_service.create_task(session, user_id, task_data.title, task_data.description)
    return task

# Similar patterns for GET/{id}, PUT/{id}, DELETE/{id}, PATCH/{id}/complete
```

### 5. JWT Authentication Middleware

```python
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

security = HTTPBearer()
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
ALGORITHM = "HS256"

async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
    if not SECRET_KEY:
        raise HTTPException(status_code=500, detail="Server configuration error")

    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token: missing user_id")
        return {"user_id": user_id}
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
```

### 6. Database Session Management

```python
from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "")
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

engine: AsyncEngine = create_async_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=300,
)

async def get_session():
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        yield session
```

## Key Principles

1. **Separation of Concerns**: Routes handle HTTP, services handle business logic
2. **User Isolation**: All queries filter by `user_id` from verified JWT
3. **Consistent Error Handling**: HTTPException with proper status codes
4. **Type Safety**: Full type hints and Pydantic validation
5. **Async First**: All I/O operations use async/await

## API Contract

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/api/{user_id}/tasks` | GET | 200 | List all tasks |
| `/api/{user_id}/tasks` | POST | 201 | Create task |
| `/api/{user_id}/tasks/{id}` | GET | 200 | Get single task |
| `/api/{user_id}/tasks/{id}` | PUT | 200 | Update task |
| `/api/{user_id}/tasks/{id}` | DELETE | 200 | Delete task |
| `/api/{user_id}/tasks/{id}/complete` | PATCH | 200 | Toggle completion |

## Error Responses

```json
{
    "detail": "Human-readable error message"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Validation error |
| 401 | Invalid/missing token |
| 403 | Forbidden (wrong user) |
| 404 | Resource not found |
| 500 | Server error |

## Dependencies

```toml
[project]
dependencies = [
    "fastapi>=0.115.0",
    "sqlmodel>=0.0.22",
    "asyncpg>=0.30.0",
    "python-jose>=3.3.0",
    "uvicorn>=0.32.0",
    "python-dotenv>=1.0.0",
]
```

## Usage

To apply this pattern to a new resource:

1. Create model in `models.py`
2. Create schemas in `schemas/{resource}.py`
3. Create service functions in `services/{resource}_service.py`
4. Create routes in `routes/{resource}.py`
5. Register router in `main.py`

---

**Version:** 1.0.0
**Extracted From:** Phase II Todo Full-Stack Application
**Last Updated:** 2025-12-29
