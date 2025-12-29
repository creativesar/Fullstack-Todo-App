---
title: Fullstack Todo Backend
emoji: 📝
colorFrom: purple
colorTo: pink
sdk: docker
pinned: false
license: mit
---

# Fullstack Todo Backend

FastAPI backend for the Fullstack Todo application with:

- FastAPI
- PostgreSQL (Neon)
- JWT Authentication
- Task CRUD operations

## Running Locally

```bash
# Install dependencies
pip install -r requirements.txt

# Run database setup
python setup_database.py

# Start server
uvicorn main:app --reload --port 8000
```

## API Endpoints

### Auth
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/signin` - Sign in and get JWT token

### Tasks
- `GET /api/{user_id}/tasks` - Get all tasks
- `POST /api/{user_id}/tasks` - Create task
- `GET /api/{user_id}/tasks/{task_id}` - Get task
- `PUT /api/{user_id}/tasks/{task_id}` - Update task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete task
- `PATCH /api/{user_id}/tasks/{task_id}/complete` - Toggle completion
