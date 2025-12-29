# Phase II - Todo Full-Stack Web Application Implementation Plan

**Version:** 1.0.0
**Phase:** Phase II - Full-Stack Web Application
**Status:** Planning
**Created:** 2025-12-29

## 1. Scope and Dependencies

### 1.1 In Scope
- **Backend API**: FastAPI server with 6 RESTful endpoints for task CRUD operations
- **Frontend UI**: Next.js 16+ App Router application with authentication and task management
- **Database**: Neon PostgreSQL with SQLModel ORM for data persistence
- **Authentication**: Better Auth with JWT token-based security
- **Deployment**: Vercel for frontend, cloud service for backend
- **Monorepo Structure**: Single repository with /frontend and /backend folders
- **Spec-Driven Artifacts**: Constitution, spec, plan, tasks files

### 1.2 Out of Scope
- Chatbot interface (Phase III)
- MCP server integration (Phase III)
- Kubernetes deployment (Phase IV)
- Kafka messaging (Phase V)
- Advanced features: recurring tasks, reminders, due dates (Phase V)
- Intermediate features: priorities, tags, search, filter, sort (Phase V)
- Real-time collaboration or WebSocket updates
- Offline support or PWA features
- Social features or task sharing

### 1.3 External Dependencies
| Dependency | Owner | Purpose | Risk Level |
|------------|-------|---------|------------|
| Neon PostgreSQL | Neon.tech | Database hosting | Low |
| Vercel | Vercel Inc. | Frontend hosting | Low |
| Better Auth | Better Auth Team | Authentication library | Medium |
| Claude Code | Anthropic | Code generation | Low |
| Backend Hosting | Railway/Render/Fly.io | Backend API hosting | Medium |

### 1.4 Internal Dependencies
- Phase I completion (understanding of todo features)
- Constitution.md approved
- Spec.md approved
- This plan.md approved before implementation
- Tasks.md generated from this plan

## 2. Key Architectural Decisions and Rationale

### 2.1 Decision: Monorepo vs Separate Repositories

**Options Considered:**
1. **Monorepo** - Single repository with /frontend and /backend folders
2. **Separate Repos** - Independent repositories for frontend and backend

**Trade-offs:**
| Aspect | Monorepo | Separate Repos |
|--------|----------|----------------|
| Claude Code Context | ✅ Single context window | ❌ Requires workspace setup |
| Cross-cutting Changes | ✅ Easier to coordinate | ❌ Multiple PRs needed |
| Deployment | ⚠️ Requires selective deployment | ✅ Independent deployments |
| Repository Size | ⚠️ Larger repo | ✅ Smaller, focused repos |
| Spec Management | ✅ Single /specs folder | ❌ Duplicated or split specs |

**Rationale:**
Choose **Monorepo** because:
- Claude Code operates more effectively in a single context
- Spec-driven development benefits from unified artifact location
- Cross-cutting changes (e.g., API contract updates) are simpler
- Hackathon timeline benefits from reduced coordination overhead
- Vercel and modern backend platforms support monorepo deployments

**Principles Applied:**
- Simplicity: Single repository reduces mental overhead
- Spec-Driven: Unified specs folder aligns with Spec-Kit Plus conventions
- Smallest Viable Change: Reuse Phase I learnings without organizational complexity

### 2.2 Decision: JWT-Based Stateless Authentication

**Options Considered:**
1. **JWT Tokens** - Stateless tokens with user claims
2. **Server-Side Sessions** - Database-backed session store
3. **OAuth Only** - Delegate entirely to third-party (Google, GitHub)

**Trade-offs:**
| Aspect | JWT Tokens | Server Sessions | OAuth Only |
|--------|-----------|-----------------|------------|
| Scalability | ✅ Stateless, horizontal scaling | ❌ Requires session store | ✅ Stateless |
| Security | ⚠️ Token theft risk | ✅ Server-controlled | ✅ Provider-managed |
| Complexity | ✅ Simple implementation | ⚠️ Requires Redis/DB | ⚠️ Provider integration |
| Offline Support | ✅ Works offline (until expiry) | ❌ Requires connectivity | ❌ Requires connectivity |
| Revocation | ❌ Difficult before expiry | ✅ Immediate revocation | ✅ Provider-controlled |

**Rationale:**
Choose **JWT Tokens** because:
- Aligns with constitution requirement for stateless architecture
- Better Auth provides JWT support out-of-the-box
- Simplifies backend (no session store needed)
- Horizontally scalable (any backend instance can verify token)
- Sufficient security for hackathon MVP (token expiry + HTTPS mitigates risks)

**Mitigation for Token Theft:**
- Short expiry (7 days)
- HTTPS-only in production
- Secure storage in httpOnly cookies (if Better Auth supports) or localStorage with XSS protections

**Principles Applied:**
- Stateless Architecture: No server-side session state
- Security First: Token verification on every request
- Performance: No database lookup for session validation

### 2.3 Decision: Next.js App Router (Not Pages Router)

**Options Considered:**
1. **App Router** - Next.js 13+ with RSC (React Server Components)
2. **Pages Router** - Traditional Next.js routing

**Trade-offs:**
| Aspect | App Router | Pages Router |
|--------|-----------|--------------|
| Server Components | ✅ Built-in RSC support | ❌ Requires additional setup |
| Learning Curve | ⚠️ Newer paradigm | ✅ Established patterns |
| Performance | ✅ Automatic code splitting | ✅ Good performance |
| Future-Proofing | ✅ Official recommendation | ⚠️ Maintenance mode |
| Community Support | ⚠️ Growing ecosystem | ✅ Mature ecosystem |

**Rationale:**
Choose **App Router** because:
- Constitution mandates Next.js 16+ with App Router
- Vercel's official recommendation for new projects
- Server Components reduce client-side JavaScript bundle
- Better separation between server and client logic
- Aligns with Phase III+ requirements (server-side AI integration)

**Principles Applied:**
- Performance: Server Components reduce client bundle size
- Separation of Concerns: Clear server/client component boundaries
- Future-Proofing: Aligns with Next.js direction

### 2.4 Decision: SQLModel for ORM

**Options Considered:**
1. **SQLModel** - Pydantic + SQLAlchemy integration
2. **SQLAlchemy (Raw)** - Traditional ORM
3. **Prisma (Python)** - Modern ORM with migrations

**Trade-offs:**
| Aspect | SQLModel | SQLAlchemy | Prisma |
|--------|----------|------------|--------|
| Type Safety | ✅ Pydantic validation | ⚠️ Manual validation | ✅ Generated types |
| Learning Curve | ✅ Simple for basic use | ⚠️ Steep learning curve | ✅ Simple, modern API |
| FastAPI Integration | ✅ Seamless | ⚠️ Requires glue code | ⚠️ Separate tool |
| Async Support | ✅ Built-in | ✅ Built-in | ✅ Built-in |
| Migrations | ⚠️ Manual (Alembic) | ✅ Alembic | ✅ Built-in migrations |

**Rationale:**
Choose **SQLModel** because:
- Constitution mandates SQLModel
- Pydantic integration provides automatic validation
- Single model definition for DB and API contracts
- FastAPI creator (Sebastián Ramírez) designed SQLModel for FastAPI
- Reduces boilerplate compared to raw SQLAlchemy

**Principles Applied:**
- Type Safety: Pydantic validation ensures data integrity
- Code Quality: Single source of truth for data models
- Maintainability: Less code to maintain vs separate DB/API models

### 2.5 Decision: Neon Serverless PostgreSQL

**Options Considered:**
1. **Neon** - Serverless PostgreSQL with branching
2. **Supabase** - PostgreSQL with built-in auth and real-time
3. **Vercel Postgres** - Neon-based Vercel offering
4. **Self-Hosted PostgreSQL** - Docker container

**Trade-offs:**
| Aspect | Neon | Supabase | Vercel Postgres | Self-Hosted |
|--------|------|----------|-----------------|-------------|
| Serverless | ✅ True serverless | ⚠️ Always-on | ✅ Serverless | ❌ Manual scaling |
| Free Tier | ✅ Generous | ✅ Generous | ✅ Same as Neon | ❌ Infrastructure cost |
| Connection Pooling | ✅ Built-in | ✅ Built-in | ✅ Built-in | ⚠️ Manual setup |
| Branching | ✅ Database branching | ❌ Not supported | ✅ Same as Neon | ❌ Manual snapshots |
| Setup Complexity | ✅ Simple | ⚠️ More features | ✅ Simple | ❌ Complex |

**Rationale:**
Choose **Neon** because:
- Constitution mandates Neon Serverless PostgreSQL
- Generous free tier for hackathon use
- Connection pooling reduces latency
- Serverless scaling handles variable load
- Database branching useful for testing (optional)

**Principles Applied:**
- Simplicity: Managed service reduces operational overhead
- Performance: Connection pooling optimizes database connections
- Cost-Effectiveness: Free tier sufficient for Phase II

## 3. Architecture Overview

### 3.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           INTERNET (HTTPS)                          │
└────────┬──────────────────────────────────────────────┬─────────────┘
         │                                               │
         │                                               │
         ▼                                               ▼
┌─────────────────────┐                       ┌──────────────────────┐
│   Vercel (CDN)      │                       │   Backend Hosting    │
│                     │                       │   (Railway/Render)   │
│  ┌───────────────┐  │                       │                      │
│  │  Next.js App  │  │  HTTP (with JWT)      │  ┌────────────────┐  │
│  │  (Frontend)   │  │──────────────────────▶│  │  FastAPI       │  │
│  │               │  │                       │  │  (Backend)     │  │
│  │  - App Router │  │◀──────────────────────│  │                │  │
│  │  - Better Auth│  │     JSON Response     │  │  - JWT Verify  │  │
│  │  - React      │  │                       │  │  - SQLModel    │  │
│  └───────────────┘  │                       │  │  - Routes      │  │
│                     │                       │  └────────┬───────┘  │
└─────────────────────┘                       │           │          │
                                              │           │          │
                                              └───────────┼──────────┘
                                                          │
                                                          │ asyncpg
                                                          │ (connection pool)
                                                          │
                                                          ▼
                                              ┌───────────────────────┐
                                              │   Neon PostgreSQL     │
                                              │   (Serverless)        │
                                              │                       │
                                              │  ┌─────────────────┐  │
                                              │  │  users table    │  │
                                              │  │  (Better Auth)  │  │
                                              │  └─────────────────┘  │
                                              │  ┌─────────────────┐  │
                                              │  │  tasks table    │  │
                                              │  │  (our app)      │  │
                                              │  └─────────────────┘  │
                                              └───────────────────────┘
```

### 3.2 Authentication Flow

```
┌──────────┐                 ┌──────────────┐                 ┌──────────────┐
│ Browser  │                 │  Next.js     │                 │  FastAPI     │
│          │                 │  (Frontend)  │                 │  (Backend)   │
└────┬─────┘                 └──────┬───────┘                 └──────┬───────┘
     │                              │                                │
     │  1. POST /auth/signin        │                                │
     ├─────────────────────────────▶│                                │
     │     (email, password)        │                                │
     │                              │                                │
     │                              │  2. Better Auth validates      │
     │                              │     credentials and creates    │
     │                              │     JWT token signed with      │
     │                              │     BETTER_AUTH_SECRET         │
     │                              │                                │
     │  3. JWT token returned       │                                │
     │◀─────────────────────────────│                                │
     │     (stored in localStorage  │                                │
     │      or httpOnly cookie)     │                                │
     │                              │                                │
     │  4. GET /api/{user_id}/tasks │                                │
     ├─────────────────────────────▶│  5. Forward request with       │
     │     Authorization: Bearer    │     Authorization header       │
     │     <token>                  ├───────────────────────────────▶│
     │                              │                                │
     │                              │                                │  6. Verify JWT
     │                              │                                │     signature
     │                              │                                │     using
     │                              │                                │     BETTER_AUTH_SECRET
     │                              │                                │
     │                              │                                │  7. Extract user_id
     │                              │                                │     from token payload
     │                              │                                │
     │                              │                                │  8. Verify user_id
     │                              │                                │     matches URL
     │                              │                                │
     │                              │                                │  9. Query tasks
     │                              │                                │     filtered by
     │                              │                                │     user_id
     │                              │                                │
     │                              │  10. Return tasks (JSON)       │
     │  11. Display tasks in UI     │◀───────────────────────────────│
     │◀─────────────────────────────│                                │
     │                              │                                │
```

### 3.3 Component Breakdown

#### 3.3.1 Frontend Components

```
frontend/
├── app/
│   ├── layout.tsx                    # Root layout with Better Auth provider
│   ├── page.tsx                      # Landing page (redirect to /signin or /tasks)
│   ├── (auth)/
│   │   ├── signin/
│   │   │   └── page.tsx              # Sign-in form (Client Component)
│   │   └── signup/
│   │       └── page.tsx              # Sign-up form (Client Component)
│   └── (protected)/
│       └── tasks/
│           ├── page.tsx              # Task list page (Server Component wrapper)
│           └── TaskList.tsx          # Task list UI (Client Component)
├── components/
│   ├── TaskCard.tsx                  # Individual task display (Client)
│   ├── TaskForm.tsx                  # Add/edit task form (Client)
│   ├── AuthButton.tsx                # Sign-out button (Client)
│   └── ErrorBoundary.tsx             # Error handling wrapper (Client)
├── lib/
│   ├── api.ts                        # Centralized API client with JWT injection
│   ├── auth.ts                       # Better Auth configuration
│   └── types.ts                      # TypeScript interfaces for API responses
├── public/
│   └── fonts/                        # Urdu font files (bonus feature)
└── styles/
    └── globals.css                   # Tailwind CSS imports
```

#### 3.3.2 Backend Components

```
backend/
├── main.py                           # FastAPI app initialization, CORS, JWT middleware
├── models.py                         # SQLModel Task model definition
├── db.py                             # Database connection, engine, session management
├── routes/
│   └── tasks.py                      # Task CRUD endpoint handlers
├── middleware/
│   └── auth.py                       # JWT verification middleware
├── schemas/
│   ├── task.py                       # Pydantic request/response models
│   └── auth.py                       # JWT token payload model
├── services/
│   └── task_service.py               # Business logic for task operations
├── utils/
│   └── jwt.py                        # JWT decoding and validation utilities
├── tests/
│   ├── test_tasks.py                 # Integration tests for task endpoints
│   └── conftest.py                   # Pytest fixtures (DB setup, mock auth)
└── alembic/                          # Database migration scripts (optional)
    └── versions/
```

### 3.4 Data Flow

#### 3.4.1 Create Task Flow

```
User → TaskForm → api.createTask() → POST /api/{user_id}/tasks
                                       ↓
                               JWT Middleware verifies token
                                       ↓
                               Extract user_id from token
                                       ↓
                               Validate request body (Pydantic)
                                       ↓
                               Task.create(user_id, title, desc)
                                       ↓
                               SQLModel INSERT query
                                       ↓
                               Neon PostgreSQL
                                       ↓
                               Return Task object (201 Created)
                                       ↓
                               Frontend updates UI
```

#### 3.4.2 List Tasks Flow

```
User → TaskList → api.getTasks() → GET /api/{user_id}/tasks
                                     ↓
                             JWT Middleware verifies token
                                     ↓
                             Extract user_id from token
                                     ↓
                             Verify user_id matches URL
                                     ↓
                             Task.list(user_id, filters)
                                     ↓
                             SQLModel SELECT query with WHERE user_id=?
                                     ↓
                             Neon PostgreSQL
                                     ↓
                             Return Task[] array (200 OK)
                                     ↓
                             Frontend renders TaskCard for each
```

## 4. API Contract Specification

### 4.1 Request/Response Standards

#### 4.1.1 Headers
**All Requests:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**All Responses:**
```
Content-Type: application/json
```

#### 4.1.2 Error Format
```json
{
    "detail": "Human-readable error message"
}
```

**Status Codes:**
- `200 OK` - Successful GET/PUT/DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Valid token but insufficient permissions
- `404 Not Found` - Resource doesn't exist
- `500 Internal Server Error` - Unexpected server error

### 4.2 Endpoint Details

#### 4.2.1 List Tasks
```
GET /api/{user_id}/tasks
```

**Path Parameters:**
- `user_id` (string, required): User identifier from JWT token

**Query Parameters:** None (filter/sort in Phase V)

**Response Body:**
```typescript
[
    {
        "id": 1,
        "title": "Task title",
        "description": "Optional description",
        "completed": false,
        "created_at": "2025-12-29T10:00:00Z",
        "updated_at": "2025-12-29T10:00:00Z"
    },
    ...
]
```

**Database Query:**
```sql
SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC;
```

#### 4.2.2 Create Task
```
POST /api/{user_id}/tasks
```

**Request Body:**
```typescript
{
    "title": string,         // Required, 1-200 chars
    "description"?: string   // Optional, max 1000 chars
}
```

**Response Body:**
```typescript
{
    "id": 1,
    "title": "Task title",
    "description": "Optional description",
    "completed": false,
    "created_at": "2025-12-29T12:00:00Z",
    "updated_at": "2025-12-29T12:00:00Z"
}
```

**Database Query:**
```sql
INSERT INTO tasks (user_id, title, description, completed, created_at, updated_at)
VALUES ($1, $2, $3, false, NOW(), NOW())
RETURNING *;
```

#### 4.2.3 Get Single Task
```
GET /api/{user_id}/tasks/{id}
```

**Path Parameters:**
- `user_id` (string, required)
- `id` (integer, required): Task ID

**Response Body:** Same as single task object in List Tasks

**Database Query:**
```sql
SELECT * FROM tasks WHERE id = $1 AND user_id = $2;
```

#### 4.2.4 Update Task
```
PUT /api/{user_id}/tasks/{id}
```

**Request Body:**
```typescript
{
    "title": string,         // Required, 1-200 chars
    "description"?: string   // Optional, max 1000 chars
}
```

**Response Body:** Updated task object

**Database Query:**
```sql
UPDATE tasks
SET title = $1, description = $2, updated_at = NOW()
WHERE id = $3 AND user_id = $4
RETURNING *;
```

#### 4.2.5 Delete Task
```
DELETE /api/{user_id}/tasks/{id}
```

**Response Body:**
```typescript
{
    "message": "Task deleted successfully"
}
```

**Database Query:**
```sql
DELETE FROM tasks WHERE id = $1 AND user_id = $2;
```

#### 4.2.6 Toggle Completion
```
PATCH /api/{user_id}/tasks/{id}/complete
```

**Request Body:** None (or optionally `{"completed": boolean}`)

**Response Body:**
```typescript
{
    "id": 1,
    "completed": true,
    "updated_at": "2025-12-29T14:00:00Z"
}
```

**Database Query:**
```sql
UPDATE tasks
SET completed = NOT completed, updated_at = NOW()
WHERE id = $1 AND user_id = $2
RETURNING id, completed, updated_at;
```

## 5. Security Architecture

### 5.1 Authentication Flow (Detailed)

#### 5.1.1 User Registration
1. User submits email + password to Better Auth endpoint
2. Better Auth hashes password (bcrypt/argon2)
3. Better Auth stores user in `users` table
4. Better Auth generates JWT token with payload: `{"sub": user_id, "exp": timestamp}`
5. JWT signed with `BETTER_AUTH_SECRET`
6. Token returned to frontend
7. Frontend stores token in localStorage (or httpOnly cookie if Better Auth supports)

#### 5.1.2 API Request Authentication
1. Frontend retrieves token from storage
2. Frontend includes token in `Authorization: Bearer <token>` header
3. Backend JWT middleware intercepts request
4. Middleware verifies token signature using `BETTER_AUTH_SECRET`
5. If signature invalid → 401 Unauthorized
6. If signature valid → decode payload to extract `user_id`
7. Middleware adds `user_id` to request context
8. Route handler accesses `user_id` from context
9. Route handler validates `user_id` in URL matches token `user_id`
10. If mismatch → 403 Forbidden
11. If match → proceed with database query filtered by `user_id`

### 5.2 Authorization Rules

| Operation | Rule | Enforcement |
|-----------|------|-------------|
| List Tasks | User can only see their own tasks | `WHERE user_id = authenticated_user_id` |
| Create Task | Task automatically associated with authenticated user | `INSERT ... VALUES (authenticated_user_id, ...)` |
| Get Task | User can only get their own tasks | `WHERE id = ? AND user_id = authenticated_user_id` |
| Update Task | User can only update their own tasks | `WHERE id = ? AND user_id = authenticated_user_id` |
| Delete Task | User can only delete their own tasks | `WHERE id = ? AND user_id = authenticated_user_id` |
| Toggle Completion | User can only toggle their own tasks | `WHERE id = ? AND user_id = authenticated_user_id` |

### 5.3 Security Checklist

- [ ] HTTPS enforced in production
- [ ] CORS restricted to Vercel frontend URL
- [ ] JWT tokens expire after 7 days
- [ ] BETTER_AUTH_SECRET is strong random string (32+ chars)
- [ ] Passwords never stored in plaintext (delegated to Better Auth)
- [ ] SQL injection prevented by parameterized queries (SQLModel)
- [ ] XSS prevented by React's default escaping
- [ ] All environment variables in .env files (not committed)
- [ ] User_id from token verified against URL user_id on every request
- [ ] Database constraints enforce referential integrity
- [ ] Error messages don't leak sensitive information

## 6. Database Design

### 6.1 Schema

#### 6.1.1 Users Table (Managed by Better Auth)
```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,                    -- UUID or similar
    email TEXT UNIQUE NOT NULL,             -- User email
    name TEXT,                              -- Display name
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Indexes:**
- Primary key on `id`
- Unique index on `email`

**We do not modify this table directly.**

#### 6.1.2 Tasks Table (Our Application)
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,                  -- Auto-incrementing task ID
    user_id TEXT NOT NULL,                  -- Foreign key to users.id
    title VARCHAR(200) NOT NULL,            -- Task title
    description TEXT,                       -- Task description (nullable)
    completed BOOLEAN DEFAULT FALSE,        -- Completion status
    created_at TIMESTAMP DEFAULT NOW(),     -- Creation timestamp
    updated_at TIMESTAMP DEFAULT NOW(),     -- Last update timestamp
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
```

**Indexes:**
- Primary key on `id` (automatic with SERIAL)
- Foreign key on `user_id` (references users.id)
- Index on `user_id` (for fast user-specific queries)
- Index on `completed` (for future filtering by status)

**Constraints:**
- `user_id` NOT NULL (every task belongs to a user)
- `title` NOT NULL (tasks must have a title)
- `title` max length 200 characters
- `completed` defaults to FALSE
- `created_at` and `updated_at` default to current timestamp
- ON DELETE CASCADE: deleting a user deletes their tasks

### 6.2 SQLModel Model Definition

```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

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
```

### 6.3 Database Operations

#### 6.3.1 Create Task
```python
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
```

#### 6.3.2 List Tasks
```python
async def list_tasks(
    session: AsyncSession,
    user_id: str
) -> List[Task]:
    statement = select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc())
    result = await session.execute(statement)
    tasks = result.scalars().all()
    return tasks
```

#### 6.3.3 Get Single Task
```python
async def get_task(
    session: AsyncSession,
    task_id: int,
    user_id: str
) -> Optional[Task]:
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()
    return task
```

#### 6.3.4 Update Task
```python
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
```

#### 6.3.5 Delete Task
```python
async def delete_task(
    session: AsyncSession,
    task_id: int,
    user_id: str
) -> bool:
    task = await get_task(session, task_id, user_id)
    if not task:
        return False
    await session.delete(task)
    await session.commit()
    return True
```

#### 6.3.6 Toggle Completion
```python
async def toggle_completion(
    session: AsyncSession,
    task_id: int,
    user_id: str
) -> Optional[Task]:
    task = await get_task(session, task_id, user_id)
    if not task:
        return None
    task.completed = not task.completed
    task.updated_at = datetime.utcnow()
    await session.commit()
    await session.refresh(task)
    return task
```

## 7. Frontend Architecture

### 7.1 Next.js App Router Structure

#### 7.1.1 Route Organization

**Public Routes (No Auth Required):**
- `/` - Landing page (redirects to /signin or /tasks based on auth status)
- `/signin` - Sign-in form
- `/signup` - Sign-up form

**Protected Routes (Auth Required):**
- `/tasks` - Task list page (main application)

#### 7.1.2 Server vs Client Components

**Server Components (Default):**
- `app/layout.tsx` - Root layout (wraps with auth provider)
- `app/page.tsx` - Landing page (checks auth, redirects)
- `app/(protected)/tasks/page.tsx` - Task page wrapper (checks auth, fetches initial data)

**Client Components (Explicitly Marked):**
- `app/(auth)/signin/page.tsx` - Sign-in form (requires useState, form handling)
- `app/(auth)/signup/page.tsx` - Sign-up form (requires useState, form handling)
- `app/(protected)/tasks/TaskList.tsx` - Task list with interactivity
- `components/TaskCard.tsx` - Individual task (toggle, edit, delete buttons)
- `components/TaskForm.tsx` - Add/edit task form (form state, submit)
- `components/AuthButton.tsx` - Sign-out button (click handler)

### 7.2 API Client Implementation

```typescript
// lib/api.ts

interface Task {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
}

interface CreateTaskRequest {
    title: string;
    description?: string;
}

interface UpdateTaskRequest {
    title: string;
    description?: string;
}

class ApiClient {
    private baseUrl: string;
    private getAuthToken: () => string | null;

    constructor(baseUrl: string, getAuthToken: () => string | null) {
        this.baseUrl = baseUrl;
        this.getAuthToken = getAuthToken;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const token = this.getAuthToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
            throw new Error(error.detail || `HTTP ${response.status}`);
        }

        return response.json();
    }

    async getTasks(userId: string): Promise<Task[]> {
        return this.request<Task[]>(`/api/${userId}/tasks`);
    }

    async createTask(userId: string, data: CreateTaskRequest): Promise<Task> {
        return this.request<Task>(`/api/${userId}/tasks`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getTask(userId: string, taskId: number): Promise<Task> {
        return this.request<Task>(`/api/${userId}/tasks/${taskId}`);
    }

    async updateTask(userId: string, taskId: number, data: UpdateTaskRequest): Promise<Task> {
        return this.request<Task>(`/api/${userId}/tasks/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteTask(userId: string, taskId: number): Promise<{ message: string }> {
        return this.request(`/api/${userId}/tasks/${taskId}`, {
            method: 'DELETE',
        });
    }

    async toggleCompletion(userId: string, taskId: number): Promise<Task> {
        return this.request<Task>(`/api/${userId}/tasks/${taskId}/complete`, {
            method: 'PATCH',
        });
    }
}

export const api = new ApiClient(
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    () => {
        // Retrieve token from localStorage or Better Auth session
        return localStorage.getItem('auth_token');
    }
);
```

### 7.3 State Management Strategy

**No Global State Library (Redux/Zustand) Needed** - Use React's built-in state management:

1. **Server State (Tasks Data):**
   - Fetched on page load in Server Component
   - Passed as props to Client Component
   - Client Component manages local copy with useState
   - Mutations (create/update/delete) update local state optimistically
   - Refresh on navigation or manual reload

2. **Authentication State:**
   - Managed by Better Auth library
   - Hooks: `useSession()`, `useAuth()`
   - Token stored in localStorage or httpOnly cookie
   - Context provider wraps entire app

3. **UI State (Modals, Forms):**
   - Local useState in components
   - No need for global state

## 8. Deployment Architecture

### 8.1 Frontend Deployment (Vercel)

**Platform:** Vercel
**Build Command:** `npm run build`
**Output Directory:** `.next`
**Framework Preset:** Next.js

**Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://backend-api-url.railway.app
NEXT_PUBLIC_BETTER_AUTH_SECRET=<same-as-backend>
```

**Deployment Steps:**
1. Connect GitHub repository to Vercel
2. Configure root directory: `/frontend`
3. Set environment variables
4. Deploy (automatic on git push to main)

### 8.2 Backend Deployment (Railway/Render/Fly.io)

**Platform:** Railway (Recommended) or Render or Fly.io
**Build Command:** `uv install`
**Start Command:** `uvicorn main:app --host 0.0.0.0 --port 8000`

**Environment Variables:**
```
DATABASE_URL=postgresql://user:password@neon-host/dbname
BETTER_AUTH_SECRET=<same-as-frontend>
CORS_ORIGINS=https://your-frontend.vercel.app
```

**Deployment Steps:**
1. Connect GitHub repository to Railway
2. Configure root directory: `/backend`
3. Set environment variables
4. Deploy (automatic on git push to main)

### 8.3 Database Setup (Neon)

1. Create Neon account and project
2. Create database (PostgreSQL 16+)
3. Copy connection string
4. Run schema creation script:
   ```sql
   CREATE TABLE tasks (
       id SERIAL PRIMARY KEY,
       user_id TEXT NOT NULL,
       title VARCHAR(200) NOT NULL,
       description TEXT,
       completed BOOLEAN DEFAULT FALSE,
       created_at TIMESTAMP DEFAULT NOW(),
       updated_at TIMESTAMP DEFAULT NOW(),
       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
   );
   CREATE INDEX idx_tasks_user_id ON tasks(user_id);
   CREATE INDEX idx_tasks_completed ON tasks(completed);
   ```
5. Add connection string to backend environment variables

## 9. Testing Strategy

### 9.1 Backend Testing

#### 9.1.1 Unit Tests
**Scope:** Business logic in service layer

**Example:**
```python
# tests/services/test_task_service.py
import pytest
from services.task_service import TaskService

@pytest.mark.asyncio
async def test_create_task_success(db_session):
    service = TaskService(db_session)
    task = await service.create_task(
        user_id="user123",
        title="Test Task",
        description="Test Description"
    )
    assert task.id is not None
    assert task.title == "Test Task"
    assert task.user_id == "user123"
    assert task.completed is False
```

#### 9.1.2 Integration Tests
**Scope:** API endpoints with database

**Example:**
```python
# tests/test_tasks.py
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_list_tasks_authenticated(client: AsyncClient, auth_token: str):
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = await client.get("/api/user123/tasks", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_list_tasks_unauthenticated(client: AsyncClient):
    response = await client.get("/api/user123/tasks")
    assert response.status_code == 401
```

#### 9.1.3 Test Fixtures
```python
# tests/conftest.py
import pytest
from sqlmodel import create_engine, Session
from fastapi.testclient import TestClient
from main import app

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    with Session(engine) as session:
        yield session
        session.rollback()

@pytest.fixture
def client(db_session):
    return TestClient(app)

@pytest.fixture
def auth_token():
    # Generate test JWT token
    return "test_jwt_token"
```

### 9.2 Frontend Testing

#### 9.2.1 Component Tests
**Scope:** React components in isolation

**Example:**
```typescript
// __tests__/TaskCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '@/components/TaskCard';

test('renders task title and description', () => {
    const task = { id: 1, title: 'Test Task', description: 'Test Desc', completed: false };
    render(<TaskCard task={task} onToggle={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Desc')).toBeInTheDocument();
});

test('calls onToggle when checkbox clicked', () => {
    const task = { id: 1, title: 'Test Task', completed: false };
    const handleToggle = jest.fn();
    render(<TaskCard task={task} onToggle={handleToggle} onDelete={jest.fn()} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleToggle).toHaveBeenCalledWith(1);
});
```

#### 9.2.2 Integration Tests
**Scope:** API client with mocked fetch

**Example:**
```typescript
// __tests__/api.test.ts
import { api } from '@/lib/api';

global.fetch = jest.fn();

test('getTasks calls correct endpoint', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => [{ id: 1, title: 'Task 1' }],
    });

    const tasks = await api.getTasks('user123');
    expect(tasks).toHaveLength(1);
    expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/user123/tasks',
        expect.objectContaining({ headers: expect.objectContaining({ Authorization: expect.any(String) }) })
    );
});
```

## 10. Performance Optimization

### 10.1 Backend Optimizations

1. **Database Connection Pooling**
   - Use asyncpg pool with min 5, max 20 connections
   - Reuse connections across requests

2. **Query Optimization**
   - Index on `user_id` for fast user-specific queries
   - Index on `completed` for future filtering
   - Use `SELECT *` sparingly (select specific columns in production)

3. **Async/Await**
   - All I/O operations (database, external APIs) use async
   - FastAPI handles concurrent requests efficiently

4. **Response Compression**
   - Enable gzip compression middleware for JSON responses > 1KB

### 10.2 Frontend Optimizations

1. **Code Splitting**
   - Automatic with Next.js App Router
   - Each route is separate chunk

2. **Server Components**
   - Reduce client-side JavaScript bundle
   - Initial render on server

3. **Image Optimization**
   - Use Next.js `<Image>` component
   - Lazy loading for images below fold

4. **Font Optimization**
   - Use next/font for automatic font optimization
   - Preload critical fonts

## 11. Monitoring and Observability

### 11.1 Backend Logging

**Log Levels:**
- ERROR: Unhandled exceptions, database errors
- WARNING: Authentication failures, invalid requests
- INFO: Request/response logs (in development)

**Log Format:**
```json
{
    "timestamp": "2025-12-29T10:00:00Z",
    "level": "INFO",
    "message": "Task created",
    "user_id": "user123",
    "task_id": 1
}
```

**Implementation:**
```python
import logging
import structlog

logger = structlog.get_logger()

@app.post("/api/{user_id}/tasks")
async def create_task(user_id: str, task_data: CreateTaskRequest):
    logger.info("task_create_requested", user_id=user_id, title=task_data.title)
    task = await task_service.create(user_id, task_data)
    logger.info("task_created", user_id=user_id, task_id=task.id)
    return task
```

### 11.2 Error Tracking

**Backend:**
- Log all exceptions with stack traces
- Return generic error messages to client (don't leak internals)

**Frontend:**
- Error boundaries catch React errors
- Display user-friendly error messages
- Log errors to console (or Sentry in production)

## 12. Risks and Mitigation

### 12.1 Technical Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Better Auth integration complexity | High | Medium | Study docs early, test JWT flow first, fallback to custom auth if blocked |
| JWT token sync issues | High | Medium | Ensure BETTER_AUTH_SECRET identical, test token verification early |
| Neon connection failures | High | Low | Connection pooling, retry logic, local PostgreSQL backup |
| Vercel/Railway deployment issues | Medium | Medium | Deploy early, test in staging, document deployment steps |
| Time pressure on spec refinement | High | High | Prioritize core features, skip bonus if needed, submit MVP |

### 12.2 Non-Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Unclear requirements | Medium | Ask clarifying questions early, validate with mockups |
| Scope creep | High | Strictly follow spec, defer non-essential features to future phases |
| Claude Code misinterpretation | Medium | Iterative spec refinement, validate generated code before moving on |

## 13. Success Criteria

### 13.1 Functional Validation Checklist

- [ ] User can sign up with email and password
- [ ] User can sign in with valid credentials
- [ ] User receives JWT token after authentication
- [ ] User can create a task with title and description
- [ ] User can view list of all their tasks
- [ ] User can update task title and description
- [ ] User can delete a task
- [ ] User can toggle task completion status
- [ ] User can only see/modify their own tasks (data isolation)
- [ ] User can log out and token is cleared
- [ ] UI is responsive on mobile, tablet, and desktop
- [ ] All API endpoints return proper status codes
- [ ] Validation errors displayed clearly in UI
- [ ] Completed tasks visually distinguished

### 13.2 Technical Validation Checklist

- [ ] All code generated via Claude Code (no manual coding)
- [ ] Constitution, spec, plan, tasks files present in repository
- [ ] JWT authentication working end-to-end
- [ ] Database schema matches specification
- [ ] All API endpoints tested and working
- [ ] Backend test coverage > 70%
- [ ] TypeScript strict mode enabled (no errors)
- [ ] Python type hints present on all functions
- [ ] No hardcoded secrets (all in .env files)
- [ ] CORS configured correctly
- [ ] Database indexes created

### 13.3 Deployment Validation Checklist

- [ ] Frontend deployed on Vercel and accessible
- [ ] Backend deployed on Railway/Render and accessible
- [ ] Database connected and operational
- [ ] Environment variables configured correctly
- [ ] HTTPS enabled on both frontend and backend
- [ ] Demo video recorded (under 90 seconds)
- [ ] README with setup instructions complete
- [ ] Public GitHub repository created

## 14. Next Steps (Tasks.md Generation)

After this plan.md is approved, proceed to tasks.md generation with:

1. **Task Breakdown Principles:**
   - Each task is atomic and testable
   - Tasks reference specific plan sections
   - Acceptance criteria for each task
   - Dependencies clearly marked
   - Estimated complexity (T-shirt sizes)

2. **Task Categories:**
   - Setup tasks (repository, dependencies)
   - Backend tasks (models, routes, middleware)
   - Frontend tasks (components, pages, API client)
   - Integration tasks (authentication flow, end-to-end)
   - Testing tasks (unit, integration)
   - Deployment tasks (Vercel, Railway, Neon)
   - Documentation tasks (README, demo video)

3. **Task Sequence:**
   - Setup → Backend → Frontend → Integration → Testing → Deployment → Documentation
   - Within each category: foundational tasks first, features second, polish third

---

**Plan Version:** 1.0.0
**Last Updated:** 2025-12-29
**Status:** Ready for Review
**Next Action:** User approval → Generate tasks.md
