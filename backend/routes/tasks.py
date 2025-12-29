"""
Task API route handlers
Implements 6 RESTful endpoints for task management
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List

from db import get_session
from middleware.auth import verify_token
from services import task_service
from schemas.task import TaskCreate, TaskUpdate, TaskResponse


router = APIRouter(prefix="/api/{user_id}/tasks", tags=["tasks"])


@router.get("", response_model=List[TaskResponse])
async def list_tasks(
    user_id: str,
    session: AsyncSession = Depends(get_session),
    auth: dict = Depends(verify_token)
):
    """
    List all tasks for the authenticated user.

    Returns:
        List of tasks ordered by creation date (newest first)
    """
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
    """
    Create a new task for the authenticated user.

    Args:
        user_id: User identifier from URL
        task_data: Task title and optional description

    Returns:
        Created task with ID
    """
    if auth["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Forbidden: Cannot create tasks for other users")

    task = await task_service.create_task(
        session,
        user_id,
        task_data.title,
        task_data.description
    )
    return task


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    user_id: str,
    task_id: int,
    session: AsyncSession = Depends(get_session),
    auth: dict = Depends(verify_token)
):
    """
    Get a single task by ID.

    Args:
        user_id: User identifier from URL
        task_id: Task ID

    Returns:
        Task object

    Raises:
        404: Task not found or doesn't belong to user
    """
    if auth["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Forbidden: Cannot access other user's tasks")

    task = await task_service.get_task(session, task_id, user_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    user_id: str,
    task_id: int,
    task_data: TaskUpdate,
    session: AsyncSession = Depends(get_session),
    auth: dict = Depends(verify_token)
):
    """
    Update a task's title and description.

    Args:
        user_id: User identifier from URL
        task_id: Task ID
        task_data: Updated title and description

    Returns:
        Updated task object

    Raises:
        404: Task not found or doesn't belong to user
    """
    if auth["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Forbidden: Cannot update other user's tasks")

    task = await task_service.update_task(
        session,
        task_id,
        user_id,
        task_data.title,
        task_data.description
    )
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task


@router.delete("/{task_id}")
async def delete_task(
    user_id: str,
    task_id: int,
    session: AsyncSession = Depends(get_session),
    auth: dict = Depends(verify_token)
):
    """
    Delete a task.

    Args:
        user_id: User identifier from URL
        task_id: Task ID

    Returns:
        Success message

    Raises:
        404: Task not found or doesn't belong to user
    """
    if auth["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Forbidden: Cannot delete other user's tasks")

    success = await task_service.delete_task(session, task_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")

    return {"message": "Task deleted successfully"}


@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def toggle_completion(
    user_id: str,
    task_id: int,
    session: AsyncSession = Depends(get_session),
    auth: dict = Depends(verify_token)
):
    """
    Toggle task completion status.

    Args:
        user_id: User identifier from URL
        task_id: Task ID

    Returns:
        Updated task with toggled completion status

    Raises:
        404: Task not found or doesn't belong to user
    """
    if auth["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Forbidden: Cannot update other user's tasks")

    task = await task_service.toggle_completion(session, task_id, user_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task
