"""
Task service layer - Business logic for task operations
"""

from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from typing import List, Optional
from datetime import datetime

from models import Task


async def create_task(
    session: AsyncSession,
    user_id: str,
    title: str,
    description: Optional[str] = None
) -> Task:
    """
    Create a new task for a user.

    Args:
        session: Database session
        user_id: User identifier
        title: Task title (1-200 chars)
        description: Optional task description (max 1000 chars)

    Returns:
        Created Task object with ID
    """
    task = Task(user_id=user_id, title=title, description=description)
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task


async def list_tasks(
    session: AsyncSession,
    user_id: str
) -> List[Task]:
    """
    List all tasks for a user, ordered by creation date (newest first).

    Args:
        session: Database session
        user_id: User identifier

    Returns:
        List of Task objects
    """
    statement = select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc())
    result = await session.execute(statement)
    tasks = result.scalars().all()
    return list(tasks)


async def get_task(
    session: AsyncSession,
    task_id: int,
    user_id: str
) -> Optional[Task]:
    """
    Get a single task by ID, ensuring it belongs to the user.

    Args:
        session: Database session
        task_id: Task ID
        user_id: User identifier

    Returns:
        Task object if found and belongs to user, None otherwise
    """
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()
    return task


async def update_task(
    session: AsyncSession,
    task_id: int,
    user_id: str,
    title: str,
    description: Optional[str] = None
) -> Optional[Task]:
    """
    Update a task's title and description.

    Args:
        session: Database session
        task_id: Task ID
        user_id: User identifier
        title: New task title
        description: New task description

    Returns:
        Updated Task object if found, None if not found or unauthorized
    """
    task = await get_task(session, task_id, user_id)
    if not task:
        return None

    task.title = title
    task.description = description
    task.updated_at = datetime.utcnow()
    await session.commit()
    await session.refresh(task)
    return task


async def delete_task(
    session: AsyncSession,
    task_id: int,
    user_id: str
) -> bool:
    """
    Delete a task.

    Args:
        session: Database session
        task_id: Task ID
        user_id: User identifier

    Returns:
        True if deleted, False if not found or unauthorized
    """
    task = await get_task(session, task_id, user_id)
    if not task:
        return False

    await session.delete(task)
    await session.commit()
    return True


async def toggle_completion(
    session: AsyncSession,
    task_id: int,
    user_id: str
) -> Optional[Task]:
    """
    Toggle task completion status.

    Args:
        session: Database session
        task_id: Task ID
        user_id: User identifier

    Returns:
        Updated Task object with toggled completion status, None if not found
    """
    task = await get_task(session, task_id, user_id)
    if not task:
        return None

    task.completed = not task.completed
    task.updated_at = datetime.utcnow()
    await session.commit()
    await session.refresh(task)
    return task
