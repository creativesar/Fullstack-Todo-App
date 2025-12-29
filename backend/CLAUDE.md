# Backend Guidelines - Todo API

## Stack
- FastAPI (Python 3.13+)
- SQLModel (ORM)
- Neon PostgreSQL (Serverless)
- UV (Package Manager)

## Project Structure
```
backend/
├── main.py              # FastAPI app entry point, CORS config
├── models.py            # SQLModel database models
├── db.py                # Database connection and session management
├── routes/
│   └── tasks.py         # Task API route handlers
├── middleware/
│   └── auth.py          # JWT verification middleware
├── schemas/
│   ├── task.py          # Pydantic request/response models
│   └── auth.py          # JWT payload models
├── services/
│   └── task_service.py  # Business logic for task operations
├── utils/
│   └── jwt.py           # JWT utilities
├── tests/
│   ├── conftest.py      # Pytest fixtures
│   ├── test_tasks.py    # Integration tests
│   └── test_task_service.py  # Unit tests
└── pyproject.toml       # UV dependencies
```

## API Conventions
- All routes under `/api/`
- Return JSON responses
- Use Pydantic models for request/response validation
- Handle errors with HTTPException
- Proper status codes: 200, 201, 400, 401, 403, 404, 500

## Database
- Use SQLModel for all database operations
- Connection string from environment variable: `DATABASE_URL`
- Async operations with asyncpg
- Connection pooling enabled

## Authentication
- JWT tokens verified with BETTER_AUTH_SECRET
- Extract user_id from token payload
- Validate user_id in URL matches token user_id
- All endpoints require authentication

## Error Handling
- Consistent JSON format: `{"detail": "error message"}`
- Log errors with context
- Don't leak sensitive information in error messages

## Running Locally
```bash
uvicorn main:app --reload --port 8000
```

## Running Tests
```bash
pytest
pytest --cov  # with coverage
```

## Code Quality
- Type hints for all function parameters and returns
- Async/await for all I/O operations
- Clear separation: routes, models, services, middleware
- Follow FastAPI best practices
