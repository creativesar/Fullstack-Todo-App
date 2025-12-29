"""
SQLModel database models for Todo application
"""

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class User(SQLModel, table=True):
    """
    SQLModel representation of users table.
    Used for authentication and task ownership.
    """
    __tablename__ = "users"

    id: Optional[str] = Field(default=None, primary_key=True, max_length=36)
    email: str = Field(unique=True, max_length=255)
    name: Optional[str] = Field(default=None, max_length=100)
    hashed_password: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Task(SQLModel, table=True):
    """
    SQLModel representation of tasks table.
    Also serves as Pydantic model for API validation.
    """
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=200, min_length=1)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
