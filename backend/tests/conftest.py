"""
Pytest configuration and fixtures for backend tests
"""
import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock
from jose import jwt
import os
from datetime import datetime
from models import Task

# Set test environment variables
os.environ["BETTER_AUTH_SECRET"] = "test-secret-key-for-testing"


@pytest.fixture(scope="session")
def event_loop():
    """Create an event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def mock_session():
    """Create a mock database session."""
    session = AsyncMock()
    session.add = MagicMock()
    session.commit = AsyncMock()
    session.refresh = AsyncMock()
    session.delete = MagicMock()
    session.execute = AsyncMock()
    return session


@pytest.fixture
def auth_token():
    """Generate a valid JWT token for testing."""
    SECRET_KEY = os.getenv("BETTER_AUTH_SECRET", "test-secret-key-for-testing")
    payload = {
        "sub": "test-user-id",
        "email": "test@example.com"
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


@pytest.fixture
def auth_headers(auth_token):
    """Return authorization headers with valid token."""
    return {"Authorization": f"Bearer {auth_token}"}


@pytest.fixture
def sample_task():
    """Return a sample Task object."""
    return Task(
        id=1,
        user_id="test-user-id",
        title="Test Task",
        description="Test description",
        completed=False,
        created_at=datetime(2025, 1, 1),
        updated_at=datetime(2025, 1, 1)
    )


@pytest.fixture
def sample_user():
    """Return a sample user dictionary."""
    return {
        "id": "test-user-id",
        "email": "test@example.com",
        "name": "Test User",
        "hashed_password": "hashedpassword123",
        "created_at": "2025-01-01T00:00:00"
    }
