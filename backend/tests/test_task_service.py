"""
Unit tests for task service layer
"""
import pytest
from unittest.mock import AsyncMock, MagicMock
from datetime import datetime

# Import the service functions
from services.task_service import (
    create_task,
    list_tasks,
    get_task,
    update_task,
    delete_task,
    toggle_completion
)
from models import Task


class TestTaskService:
    """Test cases for task service functions."""

    @pytest.mark.asyncio
    async def test_create_task_success(self, mock_session, sample_task):
        """Test successful task creation."""
        # Setup mock
        mock_session.refresh = AsyncMock()

        # Execute
        result = await create_task(
            session=mock_session,
            user_id="test-user-id",
            title="Test Task",
            description="Test description"
        )

        # Verify
        assert mock_session.add.called
        assert mock_session.commit.called
        assert mock_session.refresh.called
        assert result.title == "Test Task"
        assert result.description == "Test description"
        assert result.user_id == "test-user-id"
        assert result.completed is False

    @pytest.mark.asyncio
    async def test_create_task_minimal(self, mock_session):
        """Test task creation with only required fields."""
        mock_session.refresh = AsyncMock()

        result = await create_task(
            session=mock_session,
            user_id="test-user-id",
            title="Minimal Task"
        )

        assert result.title == "Minimal Task"
        assert result.description is None

    @pytest.mark.asyncio
    async def test_list_tasks_empty(self, mock_session):
        """Test listing tasks when none exist."""
        from sqlmodel import select

        # Mock empty result
        mock_result = MagicMock()
        mock_result.scalars().all.return_value = []
        mock_session.execute = AsyncMock(return_value=mock_result)

        result = await list_tasks(mock_session, "test-user-id")

        assert result == []
        assert mock_session.execute.called

    @pytest.mark.asyncio
    async def test_list_tasks_with_data(self, mock_session, sample_task):
        """Test listing tasks when some exist."""
        from sqlmodel import select

        # Mock result with tasks
        mock_result = MagicMock()
        mock_result.scalars().all.return_value = [sample_task]
        mock_session.execute = AsyncMock(return_value=mock_result)

        result = await list_tasks(mock_session, "test-user-id")

        assert len(result) == 1
        assert result[0].title == "Test Task"

    @pytest.mark.asyncio
    async def test_get_task_exists(self, mock_session, sample_task):
        """Test getting an existing task."""
        from sqlmodel import select

        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = sample_task
        mock_session.execute = AsyncMock(return_value=mock_result)

        result = await get_task(mock_session, 1, "test-user-id")

        assert result is not None
        assert result.id == 1
        assert result.title == "Test Task"

    @pytest.mark.asyncio
    async def test_get_task_not_found(self, mock_session):
        """Test getting a non-existent task."""
        from sqlmodel import select

        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = None
        mock_session.execute = AsyncMock(return_value=mock_result)

        result = await get_task(mock_session, 999, "test-user-id")

        assert result is None

    @pytest.mark.asyncio
    async def test_update_task_success(self, mock_session, sample_task):
        """Test successful task update."""
        from sqlmodel import select

        # First call returns the task, second call after refresh
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = sample_task
        mock_session.execute = AsyncMock(return_value=mock_result)
        mock_session.refresh = AsyncMock()

        result = await update_task(
            mock_session,
            task_id=1,
            user_id="test-user-id",
            title="Updated Title",
            description="Updated Description"
        )

        assert mock_session.commit.called
        assert mock_session.refresh.called
        assert result is not None

    @pytest.mark.asyncio
    async def test_update_task_not_found(self, mock_session):
        """Test updating a non-existent task."""
        from sqlmodel import select

        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = None
        mock_session.execute = AsyncMock(return_value=mock_result)

        result = await update_task(
            mock_session,
            task_id=999,
            user_id="test-user-id",
            title="Updated Title"
        )

        assert result is None
        assert not mock_session.commit.called

    @pytest.mark.asyncio
    async def test_delete_task_success(self, mock_session, sample_task):
        """Test successful task deletion."""
        from sqlmodel import select

        mock_session.delete = AsyncMock()

        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = sample_task
        mock_session.execute = AsyncMock(return_value=mock_result)

        result = await delete_task(mock_session, 1, "test-user-id")

        assert result is True
        assert mock_session.delete.called
        assert mock_session.commit.called

    @pytest.mark.asyncio
    async def test_delete_task_not_found(self, mock_session):
        """Test deleting a non-existent task."""
        from sqlmodel import select

        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = None
        mock_session.execute = AsyncMock(return_value=mock_result)

        result = await delete_task(mock_session, 999, "test-user-id")

        assert result is False
        assert not mock_session.delete.called

    @pytest.mark.asyncio
    async def test_toggle_completion(self, mock_session, sample_task):
        """Test toggling task completion."""
        from sqlmodel import select

        # Create a fresh task with completed=False for the test
        from datetime import datetime
        incomplete_task = Task(
            id=1,
            user_id="test-user-id",
            title="Test Task",
            description="Test description",
            completed=False,
            created_at=datetime(2025, 1, 1),
            updated_at=datetime(2025, 1, 1)
        )

        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = incomplete_task
        mock_session.execute = AsyncMock(return_value=mock_result)
        mock_session.refresh = AsyncMock()

        result = await toggle_completion(mock_session, 1, "test-user-id")

        assert mock_session.commit.called
        assert mock_session.refresh.called


class TestTaskModel:
    """Test cases for Task model."""

    def test_task_creation(self):
        """Test Task model instantiation."""
        task = Task(
            user_id="user-123",
            title="Test Task",
            description="Description"
        )

        assert task.user_id == "user-123"
        assert task.title == "Test Task"
        assert task.description == "Description"
        assert task.completed is False

    def test_task_default_completed(self):
        """Test that completed defaults to False."""
        task = Task(user_id="user-123", title="Test")

        assert task.completed is False
