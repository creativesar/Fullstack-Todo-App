# Phase II - Todo Full-Stack Web Application Tasks

**Version:** 1.0.0
**Phase:** Phase II - Full-Stack Web Application
**Status:** Ready for Implementation
**Created:** 2025-12-29

## Task Organization

Tasks are organized into sequential phases with dependencies clearly marked. Each task includes:
- **Task ID**: Unique identifier
- **Title**: Clear, action-oriented description
- **Category**: Setup, Backend, Frontend, Integration, Testing, Deployment, Documentation
- **Size**: T-shirt sizing (XS, S, M, L, XL)
- **Dependencies**: Tasks that must complete first
- **Spec Reference**: Links to spec.md and plan.md sections
- **Acceptance Criteria**: Testable completion conditions

---

## Phase 1: Project Setup

### T001: Initialize Monorepo Structure
**Category:** Setup
**Size:** S
**Dependencies:** None
**Spec Reference:** constitution.md §Monorepo Structure, plan.md §3.3

**Description:**
Create the monorepo folder structure with frontend, backend, and specs directories.

**Implementation Steps:**
1. Create root directory structure:
   ```
   hackathon-todo/
   ├── .specify/
   │   ├── memory/
   │   └── templates/
   ├── specs/
   │   └── phase-ii-fullstack/
   ├── history/
   │   ├── prompts/
   │   └── adr/
   ├── frontend/
   ├── backend/
   ├── CLAUDE.md
   ├── README.md
   └── .gitignore
   ```

2. Copy constitution.md, spec.md, plan.md, tasks.md to specs/phase-ii-fullstack/
3. Create .gitignore with Node, Python, environment files
4. Initialize Git repository

**Acceptance Criteria:**
- [X] All directories created
- [X] Spec files in correct locations
- [X] Git repository initialized
- [X] .gitignore excludes node_modules, __pycache__, .env, .venv

---

### T002: Setup Backend Project (FastAPI)
**Category:** Setup
**Size:** M
**Dependencies:** T001
**Spec Reference:** plan.md §3.3.2, constitution.md §Technology Stack

**Description:**
Initialize Python FastAPI project with UV package manager and required dependencies.

**Implementation Steps:**
1. Navigate to /backend directory
2. Initialize UV project: `uv init`
3. Add dependencies to pyproject.toml:
   ```toml
   [project]
   name = "todo-backend"
   version = "0.1.0"
   dependencies = [
       "fastapi>=0.104.0",
       "uvicorn[standard]>=0.24.0",
       "sqlmodel>=0.0.14",
       "asyncpg>=0.29.0",
       "python-jose[cryptography]>=3.3.0",
       "pydantic>=2.5.0",
       "pydantic-settings>=2.1.0",
       "python-multipart>=0.0.6"
   ]
   [project.optional-dependencies]
   dev = [
       "pytest>=7.4.0",
       "pytest-asyncio>=0.21.0",
       "httpx>=0.25.0"
   ]
   ```
4. Install dependencies: `uv sync`
5. Create main.py with basic FastAPI app:
   ```python
   from fastapi import FastAPI

   app = FastAPI(title="Todo API", version="1.0.0")

   @app.get("/health")
   async def health_check():
       return {"status": "healthy"}
   ```

**Acceptance Criteria:**
- [X] pyproject.toml with all required dependencies
- [X] UV lock file generated
- [X] Dependencies installed successfully
- [X] FastAPI app runs with `uvicorn main:app --reload`
- [X] Health endpoint returns 200 OK
- [X] backend/CLAUDE.md created with backend-specific guidelines

---

### T003: Setup Frontend Project (Next.js)
**Category:** Setup
**Size:** M
**Dependencies:** T001
**Spec Reference:** plan.md §3.3.1, constitution.md §Technology Stack

**Description:**
Initialize Next.js 16+ project with TypeScript, Tailwind CSS, and Better Auth.

**Implementation Steps:**
1. Navigate to /frontend directory
2. Create Next.js app: `npx create-next-app@latest . --typescript --tailwind --app --no-src-dir`
3. Install Better Auth: `npm install better-auth`
4. Install additional dependencies: `npm install @heroicons/react`
5. Configure tsconfig.json with strict mode:
   ```json
   {
       "compilerOptions": {
           "strict": true,
           "noUncheckedIndexedAccess": true,
           "noImplicitReturns": true
       }
   }
   ```
6. Create basic layout in app/layout.tsx
7. Create placeholder pages: app/page.tsx, app/(auth)/signin/page.tsx

**Acceptance Criteria:**
- [X] package.json with all required dependencies
- [X] TypeScript strict mode enabled
- [X] Tailwind CSS configured
- [X] Next.js dev server runs with `npm run dev`
- [X] No TypeScript errors
- [X] frontend/CLAUDE.md created with frontend-specific guidelines

---

### T004: Setup Neon PostgreSQL Database
**Category:** Setup
**Size:** S
**Dependencies:** None
**Spec Reference:** plan.md §6.1, constitution.md §Technology Stack

**Description:**
Create Neon PostgreSQL database and initialize schema.

**Implementation Steps:**
1. Create Neon account at neon.tech
2. Create new project: "hackathon-todo"
3. Create database: "todo_db"
4. Copy connection string
5. Run schema creation SQL:
   ```sql
   CREATE TABLE IF NOT EXISTS users (
       id TEXT PRIMARY KEY,
       email TEXT UNIQUE NOT NULL,
       name TEXT,
       created_at TIMESTAMP DEFAULT NOW()
   );

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

**Acceptance Criteria:**
- [X] Neon account created
- [X] Database created successfully
- [X] Schema applied (users and tasks tables exist)
- [X] Indexes created
- [X] Connection string saved securely (not committed)
- [X] Test connection successful from local machine

---

### T005: Configure Environment Variables
**Category:** Setup
**Size:** XS
**Dependencies:** T002, T003, T004
**Spec Reference:** constitution.md §Security Constraints, plan.md §8

**Description:**
Create .env files for frontend and backend with required configuration.

**Implementation Steps:**
1. Create backend/.env:
   ```
   DATABASE_URL=postgresql://user:password@neon-host/todo_db
   BETTER_AUTH_SECRET=<generate-random-32-char-string>
   CORS_ORIGINS=http://localhost:3000
   ```
2. Create frontend/.env.local:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_BETTER_AUTH_SECRET=<same-as-backend>
   ```
3. Create backend/.env.example and frontend/.env.example with placeholder values
4. Add .env* to .gitignore (verify not committed)

**Acceptance Criteria:**
- [X] Backend .env with DATABASE_URL, BETTER_AUTH_SECRET, CORS_ORIGINS
- [X] Frontend .env.local with API_URL and BETTER_AUTH_SECRET
- [X] BETTER_AUTH_SECRET identical in both files (32+ characters, random)
- [X] .env.example files created with placeholders
- [X] .env files NOT tracked by Git

---

## Phase 2: Backend Core Implementation

### T006: Create SQLModel Database Models
**Category:** Backend
**Size:** S
**Dependencies:** T002, T004
**Spec Reference:** plan.md §6.2, spec.md §6.2

**Description:**
Define SQLModel Task model with proper type annotations and constraints.

**Implementation Steps:**
1. Create backend/models.py:
   ```python
   from sqlmodel import SQLModel, Field
   from datetime import datetime
   from typing import Optional

   class Task(SQLModel, table=True):
       __tablename__ = "tasks"

       id: Optional[int] = Field(default=None, primary_key=True)
       user_id: str = Field(foreign_key="users.id", index=True)
       title: str = Field(max_length=200, min_length=1)
       description: Optional[str] = Field(default=None, max_length=1000)
       completed: bool = Field(default=False)
       created_at: datetime = Field(default_factory=datetime.utcnow)
       updated_at: datetime = Field(default_factory=datetime.utcnow)
   ```

**Acceptance Criteria:**
- [X] Task model defined with all fields from spec
- [X] Type hints for all fields
- [X] Foreign key to users.id
- [X] Constraints (max_length, min_length) applied
- [X] Default values set correctly
- [X] No Python linting errors

---

### T007: Create Database Connection Module
**Category:** Backend
**Size:** M
**Dependencies:** T006
**Spec Reference:** plan.md §6.3, constitution.md §Database Standards

**Description:**
Set up async database connection with SQLModel engine and session management.

**Implementation Steps:**
1. Create backend/db.py:
   ```python
   from sqlmodel import SQLModel, create_engine
   from sqlmodel.ext.asyncio.session import AsyncSession, AsyncEngine
   from sqlalchemy.ext.asyncio import create_async_engine
   from sqlalchemy.orm import sessionmaker
   import os

   DATABASE_URL = os.getenv("DATABASE_URL", "").replace("postgresql://", "postgresql+asyncpg://")

   engine: AsyncEngine = create_async_engine(
       DATABASE_URL,
       echo=True,  # Set to False in production
       future=True
   )

   async def get_session() -> AsyncSession:
       async_session = sessionmaker(
           engine, class_=AsyncSession, expire_on_commit=False
       )
       async with async_session() as session:
           yield session
   ```

2. Create dependency injection for FastAPI routes

**Acceptance Criteria:**
- [X] Database URL loaded from environment variable
- [X] Async engine created with asyncpg
- [X] Session factory configured
- [X] get_session() dependency works with FastAPI
- [X] Connection pooling enabled
- [X] Test connection successful

---

### T008: Implement JWT Authentication Middleware
**Category:** Backend
**Size:** L
**Dependencies:** T002, T005
**Spec Reference:** plan.md §5.1, constitution.md §Authentication Flow

**Description:**
Create JWT token verification middleware for authenticating API requests.

**Implementation Steps:**
1. Create backend/middleware/auth.py:
   ```python
   from fastapi import HTTPException, Security
   from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
   from jose import JWTError, jwt
   import os

   security = HTTPBearer()
   SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
   ALGORITHM = "HS256"

   async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
       token = credentials.credentials
       try:
           payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
           user_id: str = payload.get("sub")
           if user_id is None:
               raise HTTPException(status_code=401, detail="Invalid token")
           return {"user_id": user_id}
       except JWTError:
           raise HTTPException(status_code=401, detail="Invalid token")
   ```

2. Create backend/schemas/auth.py for JWT payload model
3. Add dependency to routes requiring authentication

**Acceptance Criteria:**
- [X] JWT token verification function implemented
- [X] Uses BETTER_AUTH_SECRET from environment
- [X] Returns user_id from token payload
- [X] Raises 401 for invalid/expired tokens
- [X] Raises 401 for missing Authorization header
- [ ] Unit tests for valid and invalid tokens

---

### T009: Create Task Service Layer
**Category:** Backend
**Size:** M
**Dependencies:** T006, T007
**Spec Reference:** plan.md §6.3, constitution.md §Code Quality Standards

**Description:**
Implement business logic for task CRUD operations in a service layer.

**Implementation Steps:**
1. Create backend/services/task_service.py with functions:
   - `create_task(session, user_id, title, description) -> Task`
   - `list_tasks(session, user_id) -> List[Task]`
   - `get_task(session, task_id, user_id) -> Optional[Task]`
   - `update_task(session, task_id, user_id, title, description) -> Optional[Task]`
   - `delete_task(session, task_id, user_id) -> bool`
   - `toggle_completion(session, task_id, user_id) -> Optional[Task]`

2. All functions async with proper type hints
3. User isolation enforced in all queries

**Acceptance Criteria:**
- [X] All 6 CRUD operations implemented
- [X] Type hints on all function parameters and returns
- [X] User_id filtering in all queries
- [X] updated_at timestamp updated on modifications
- [X] Returns None/False for not found instead of raising exception
- [X] No raw SQL queries (SQLModel only)

---

### T010: Implement Task API Routes
**Category:** Backend
**Size:** L
**Dependencies:** T008, T009
**Spec Reference:** plan.md §4.2, spec.md §7.2

**Description:**
Create FastAPI route handlers for all 6 task endpoints with authentication and validation.

**Implementation Steps:**
1. Create backend/routes/tasks.py:
   ```python
   from fastapi import APIRouter, Depends, HTTPException
   from sqlmodel.ext.asyncio.session import AsyncSession
   from typing import List
   from ..db import get_session
   from ..middleware.auth import verify_token
   from ..services import task_service
   from ..schemas.task import TaskCreate, TaskUpdate, TaskResponse

   router = APIRouter(prefix="/api/{user_id}/tasks", tags=["tasks"])

   @router.get("", response_model=List[TaskResponse])
   async def list_tasks(
       user_id: str,
       session: AsyncSession = Depends(get_session),
       auth: dict = Depends(verify_token)
   ):
       if auth["user_id"] != user_id:
           raise HTTPException(status_code=403, detail="Forbidden")
       tasks = await task_service.list_tasks(session, user_id)
       return tasks

   # Implement POST, GET /{id}, PUT /{id}, DELETE /{id}, PATCH /{id}/complete
   ```

2. Create backend/schemas/task.py for request/response models
3. Register router in main.py

**Acceptance Criteria:**
- [X] All 6 endpoints implemented
- [X] JWT authentication on all endpoints
- [X] User_id from token validated against URL user_id
- [X] Pydantic models for request/response validation
- [X] Proper HTTP status codes (200, 201, 400, 401, 403, 404)
- [X] Error responses in consistent format: {"detail": "message"}
- [X] CORS middleware configured

---

### T011: Add CORS and Error Handling Middleware
**Category:** Backend
**Size:** S
**Dependencies:** T010
**Spec Reference:** plan.md §5, constitution.md §Security Constraints

**Description:**
Configure CORS for frontend origin and global error handling.

**Implementation Steps:**
1. Update backend/main.py:
   ```python
   from fastapi.middleware.cors import CORSMiddleware
   import os

   app = FastAPI(title="Todo API", version="1.0.0")

   origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

   app.add_middleware(
       CORSMiddleware,
       allow_origins=origins,
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. Add global exception handler for 500 errors

**Acceptance Criteria:**
- [X] CORS configured with frontend origin from environment
- [X] Preflight requests (OPTIONS) handled correctly
- [X] 500 errors return generic message (don't leak stack traces)
- [X] All errors return JSON format

---

## Phase 3: Frontend Core Implementation

### T012: Configure Better Auth
**Category:** Frontend
**Size:** M
**Dependencies:** T003, T005
**Spec Reference:** plan.md §3.1, constitution.md §Authentication Flow

**Description:**
Set up Better Auth library for user authentication with JWT tokens.

**Implementation Steps:**
1. Create frontend/lib/auth.ts:
   ```typescript
   import { BetterAuth } from "better-auth";

   export const auth = new BetterAuth({
       secret: process.env.NEXT_PUBLIC_BETTER_AUTH_SECRET!,
       database: {
           // Configure to use backend API or separate DB
       },
       jwt: {
           enabled: true,
           expiresIn: "7d",
       },
   });
   ```

2. Create auth provider wrapper in app/layout.tsx
3. Implement signup/signin functions

**Acceptance Criteria:**
- [X] Better Auth configured with JWT enabled
- [X] Token expiration set to 7 days
- [X] Auth provider wraps entire app
- [X] Signup function returns JWT token
- [X] Signin function returns JWT token
- [X] Token stored in localStorage or httpOnly cookie
- [X] BETTER_AUTH_SECRET matches backend

---

### T013: Create API Client Module
**Category:** Frontend
**Size:** M
**Dependencies:** T012
**Spec Reference:** plan.md §7.2, constitution.md §Code Quality Standards

**Description:**
Build centralized API client with JWT token injection for all backend requests.

**Implementation Steps:**
1. Create frontend/lib/api.ts with ApiClient class (see plan.md §7.2 for full implementation)
2. Implement methods for all 6 task endpoints:
   - getTasks(userId): Promise<Task[]>
   - createTask(userId, data): Promise<Task>
   - getTask(userId, taskId): Promise<Task>
   - updateTask(userId, taskId, data): Promise<Task>
   - deleteTask(userId, taskId): Promise<{message: string}>
   - toggleCompletion(userId, taskId): Promise<Task>

3. Create frontend/lib/types.ts for TypeScript interfaces

**Acceptance Criteria:**
- [X] ApiClient class with all 6 methods
- [X] JWT token automatically included in Authorization header
- [X] Proper error handling (parse JSON error responses)
- [X] TypeScript interfaces for Task, CreateTaskRequest, UpdateTaskRequest
- [X] Base URL from environment variable
- [X] All methods return typed Promises

---

### T014: Build Authentication Pages (Signin/Signup)
**Category:** Frontend
**Size:** L
**Dependencies:** T012, T013
**Spec Reference:** spec.md §3.1, constitution.md §Frontend Standards

**Description:**
Create sign-in and sign-up forms with Better Auth integration.

**Implementation Steps:**
1. Create app/(auth)/signin/page.tsx (Client Component):
   - Email and password input fields
   - Submit button
   - Form validation
   - Error message display
   - Link to signup page

2. Create app/(auth)/signup/page.tsx (Client Component):
   - Email, password, confirm password fields
   - Submit button
   - Form validation (password strength, email format)
   - Error message display
   - Link to signin page

3. Integrate Better Auth signup/signin functions
4. Redirect to /tasks on successful authentication

**Acceptance Criteria:**
- [X] Signin form with email/password fields
- [X] Signup form with email/password/confirm fields
- [X] Client-side validation (email format, password length 8+)
- [X] Error messages displayed for invalid credentials
- [X] Successful auth redirects to /tasks page
- [X] JWT token stored after successful auth
- [X] Links between signin and signup pages
- [X] Responsive layout (mobile-friendly)
- [X] Accessibility: labels, aria-attributes

---

### T015: Create Task List Page (Protected Route)
**Category:** Frontend
**Size:** L
**Dependencies:** T013, T014
**Spec Reference:** spec.md §3.2, plan.md §7.1

**Description:**
Build main task list page with authentication guard and task display.

**Implementation Steps:**
1. Create app/(protected)/tasks/page.tsx (Server Component):
   - Check authentication status
   - Redirect to /signin if not authenticated
   - Fetch initial tasks (server-side)
   - Pass tasks to client component

2. Create app/(protected)/tasks/TaskList.tsx (Client Component):
   - Display tasks in a list
   - Show empty state if no tasks
   - Integrate TaskCard components
   - Integrate TaskForm component
   - Handle task mutations (create, update, delete, toggle)

3. Add route protection middleware

**Acceptance Criteria:**
- [X] Page redirects to /signin if not authenticated
- [X] Tasks fetched on page load
- [X] TaskList component renders all user's tasks
- [X] Empty state message when no tasks
- [X] Add task button/form visible
- [X] Tasks ordered by created_at (newest first)
- [X] Loading state during fetch
- [X] Error message if fetch fails

---

### T016: Build Task Card Component
**Category:** Frontend
**Size:** M
**Dependencies:** T013
**Spec Reference:** spec.md §3.2, plan.md §7.3

**Description:**
Create reusable TaskCard component for displaying individual tasks.

**Implementation Steps:**
1. Create components/TaskCard.tsx (Client Component):
   ```typescript
   interface TaskCardProps {
       task: Task;
       onToggle: (id: number) => void;
       onEdit: (id: number) => void;
       onDelete: (id: number) => void;
   }

   export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
       return (
           <div className={task.completed ? "opacity-50" : ""}>
               <input
                   type="checkbox"
                   checked={task.completed}
                   onChange={() => onToggle(task.id)}
               />
               <h3 className={task.completed ? "line-through" : ""}>
                   {task.title}
               </h3>
               {task.description && <p>{task.description}</p>}
               <button onClick={() => onEdit(task.id)}>Edit</button>
               <button onClick={() => onDelete(task.id)}>Delete</button>
           </div>
       );
   }
   ```

2. Style with Tailwind CSS
3. Add accessibility attributes

**Acceptance Criteria:**
- [X] Displays task title, description, completion status
- [X] Checkbox for toggling completion (calls onToggle)
- [X] Edit button (calls onEdit)
- [X] Delete button (calls onDelete)
- [X] Completed tasks styled differently (strikethrough, muted color)
- [X] Responsive layout
- [X] Accessibility: proper labels, keyboard navigation
- [X] Touch-friendly buttons (44px+ touch targets)

---

### T017: Build Task Form Component (Add/Edit)
**Category:** Frontend
**Size:** M
**Dependencies:** T013
**Spec Reference:** spec.md §3.2, constitution.md §Frontend Standards

**Description:**
Create form component for adding and editing tasks.

**Implementation Steps:**
1. Create components/TaskForm.tsx (Client Component):
   ```typescript
   interface TaskFormProps {
       task?: Task;  // undefined for add, Task for edit
       userId: string;
       onSave: (task: Task) => void;
       onCancel: () => void;
   }

   export function TaskForm({ task, userId, onSave, onCancel }: TaskFormProps) {
       const [title, setTitle] = useState(task?.title || "");
       const [description, setDescription] = useState(task?.description || "");
       const [error, setError] = useState("");

       const handleSubmit = async (e: React.FormEvent) => {
           e.preventDefault();
           if (!title.trim()) {
               setError("Title is required");
               return;
           }
           try {
               const savedTask = task
                   ? await api.updateTask(userId, task.id, { title, description })
                   : await api.createTask(userId, { title, description });
               onSave(savedTask);
           } catch (err) {
               setError(err.message);
           }
       };

       return (
           <form onSubmit={handleSubmit}>
               <input
                   type="text"
                   placeholder="Task title"
                   value={title}
                   onChange={(e) => setTitle(e.target.value)}
                   maxLength={200}
                   required
               />
               <textarea
                   placeholder="Description (optional)"
                   value={description}
                   onChange={(e) => setDescription(e.target.value)}
                   maxLength={1000}
               />
               {error && <p className="text-red-500">{error}</p>}
               <button type="submit">Save</button>
               <button type="button" onClick={onCancel}>Cancel</button>
           </form>
       );
   }
   ```

2. Style with Tailwind CSS
3. Add client-side validation

**Acceptance Criteria:**
- [X] Form works for both add (no task prop) and edit (with task prop)
- [X] Title input (required, 1-200 chars)
- [X] Description textarea (optional, max 1000 chars)
- [X] Submit button creates or updates task
- [X] Cancel button closes form without saving
- [X] Validation error displayed for empty title
- [X] API error displayed if request fails
- [X] Form cleared after successful save (add mode)
- [X] Responsive layout

---

### T018: Add Logout Functionality
**Category:** Frontend
**Size:** XS
**Dependencies:** T012, T015
**Spec Reference:** spec.md §3.1, constitution.md §Authentication Flow

**Description:**
Implement logout button that clears JWT token and redirects to landing page.

**Implementation Steps:**
1. Create components/AuthButton.tsx (Client Component):
   ```typescript
   "use client";
   import { useAuth } from "@/lib/auth";
   import { useRouter } from "next/navigation";

   export function AuthButton() {
       const router = useRouter();
       const handleLogout = () => {
           localStorage.removeItem("auth_token");
           router.push("/");
       };

       return (
           <button onClick={handleLogout}>
               Logout
           </button>
       );
   }
   ```

2. Add AuthButton to task page layout

**Acceptance Criteria:**
- [X] Logout button visible on /tasks page
- [X] Clicking logout clears token from storage
- [X] Redirects to landing page (/) after logout
- [X] Cannot access /tasks after logout (redirects to /signin)
- [X] Styled appropriately (Tailwind CSS)

---

## Phase 4: Integration and Testing

### T019: Integrate Frontend and Backend (End-to-End Flow)
**Category:** Integration
**Size:** L
**Dependencies:** T011, T018
**Spec Reference:** plan.md §3.4, spec.md §11

**Description:**
Test complete user flow from signup to task management to logout.

**Implementation Steps:**
1. Run backend: `cd backend && uvicorn main:app --reload`
2. Run frontend: `cd frontend && npm run dev`
3. Test full flow:
   - Sign up new user
   - Create 3 tasks
   - Mark 1 task complete
   - Edit 1 task
   - Delete 1 task
   - Logout
   - Sign in again
   - Verify tasks persisted

4. Fix any integration issues discovered

**Acceptance Criteria:**
- [X] User can sign up successfully
- [X] JWT token issued after signup
- [X] User redirected to /tasks page
- [X] Can create tasks (appear immediately in list)
- [X] Can toggle task completion (UI updates immediately)
- [X] Can edit task (changes reflected in list)
- [X] Can delete task (removed from list)
- [X] Tasks persisted in database (survive page refresh)
- [X] Logout clears token
- [X] Sign in restores access to saved tasks
- [X] No console errors in browser or backend

---

### T020: Write Backend Unit Tests
**Category:** Testing
**Size:** M
**Dependencies:** T011
**Spec Reference:** plan.md §9.1, constitution.md §Testing Requirements

**Description:**
Write unit tests for task service layer and API endpoints.

**Implementation Steps:**
1. Create backend/tests/conftest.py with fixtures:
   - `db_session`: In-memory SQLite session
   - `client`: TestClient with mocked auth
   - `auth_token`: Valid JWT token for tests

2. Create backend/tests/test_task_service.py:
   - Test create_task (valid input, empty title)
   - Test list_tasks (empty, multiple tasks, user isolation)
   - Test get_task (exists, not found, wrong user)
   - Test update_task (valid, not found, wrong user)
   - Test delete_task (valid, not found, wrong user)
   - Test toggle_completion (valid, not found)

3. Create backend/tests/test_tasks_api.py:
   - Test all 6 endpoints with valid authentication
   - Test all endpoints without authentication (401)
   - Test all endpoints with wrong user_id (403)

**Acceptance Criteria:**
- [X] Test coverage > 70% (run `pytest --cov`)
- [X] All service layer functions tested
- [X] All API endpoints tested
- [X] Authentication tests (valid token, invalid token, missing token)
- [X] Authorization tests (wrong user_id)
- [X] Edge cases tested (empty title, not found, etc.)
- [X] All tests pass with `pytest`

---

### T021: Write Frontend Component Tests
**Category:** Testing
**Size:** M
**Dependencies:** T018
**Spec Reference:** plan.md §9.2, constitution.md §Testing Requirements

**Description:**
Write unit tests for React components and API client.

**Implementation Steps:**
1. Install testing libraries: `npm install --save-dev @testing-library/react @testing-library/jest-dom jest-environment-jsdom`

2. Create __tests__/TaskCard.test.tsx:
   - Test renders task title and description
   - Test checkbox toggles on click
   - Test edit button calls onEdit
   - Test delete button calls onDelete

3. Create __tests__/TaskForm.test.tsx:
   - Test renders empty form for add mode
   - Test renders filled form for edit mode
   - Test validation error for empty title
   - Test submit calls API

4. Create __tests__/api.test.ts:
   - Mock fetch
   - Test all 6 API methods
   - Test Authorization header included
   - Test error handling

**Acceptance Criteria:**
- [X] TaskCard tests pass
- [X] TaskForm tests pass
- [X] API client tests pass
- [X] All tests run with `npm test`
- [X] No console errors during tests

---

### T022: Implement Responsive Design Polish
**Category:** Frontend
**Size:** M
**Dependencies:** T018
**Spec Reference:** spec.md §5, constitution.md §Code Quality Standards

**Description:**
Ensure UI works correctly on mobile, tablet, and desktop screen sizes.

**Implementation Steps:**
1. Test on mobile (375px), tablet (768px), desktop (1024px+)
2. Adjust Tailwind CSS classes for responsive breakpoints:
   - Use `sm:`, `md:`, `lg:` prefixes
   - Single column on mobile, multi-column on desktop
   - Adjust font sizes for readability
   - Ensure touch targets are 44px+ on mobile

3. Add loading spinners for async operations
4. Add success/error toast notifications

**Acceptance Criteria:**
- [X] Layout adapts to mobile, tablet, desktop
- [X] All text readable on small screens
- [X] Buttons and checkboxes touch-friendly (44px+ on mobile)
- [X] Forms usable on mobile (no horizontal scroll)
- [X] Loading indicators during API calls
- [X] Success/error messages displayed after operations
- [X] No horizontal scrollbars on any screen size

---

## Phase 5: Deployment

### T023: Deploy Backend to Railway (or Render/Fly.io/Hugging Face Spaces)
**Category:** Deployment
**Size:** M
**Dependencies:** T011, T020
**Spec Reference:** plan.md §8.2, constitution.md §Deployment Requirements

**Description:**
Deploy FastAPI backend to cloud hosting service.

**Implementation Steps:**

**Option A: Railway/Render/Fly.io**
1. Create Railway account (or Render/Fly.io)
2. Connect GitHub repository
3. Configure Railway project:
   - Root directory: `/backend`
   - Build command: `uv sync`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. Set environment variables in Railway dashboard:
   - DATABASE_URL: (Neon connection string)
   - BETTER_AUTH_SECRET: (same as local)
   - CORS_ORIGINS: (Vercel frontend URL)

5. Deploy and verify health endpoint

**Option B: Hugging Face Spaces**
1. Create Hugging Face account at https://huggingface.co
2. Create new Space:
   - Click "Create new Space"
   - Name: `todo-app-backend`
   - License: MIT
   - SDK: Docker
   - Hardware: CPU Basic (free tier)

3. Create `backend/Dockerfile` if not exists:
   ```dockerfile
   FROM python:3.11-slim

   WORKDIR /app

   # Install uv
   RUN pip install uv

   # Copy backend files
   COPY . .

   # Install dependencies
   RUN uv sync

   # Expose port 7860 (required by Hugging Face)
   EXPOSE 7860

   # Start FastAPI
   CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
   ```

4. Create `backend/README.md` for Space configuration:
   ```markdown
   ---
   title: Todo App Backend
   emoji: ✅
   colorFrom: blue
   colorTo: green
   sdk: docker
   app_port: 7860
   ---
   ```

5. Push backend code to Hugging Face Space:
   ```bash
   cd backend
   git init
   git remote add space https://huggingface.co/spaces/YOUR_USERNAME/todo-app-backend
   git add .
   git commit -m "Deploy backend to HF Spaces"
   git push space main
   ```

6. Configure Secrets in Space Settings:
   - Go to Space Settings > Variables and secrets
   - Add secrets:
     - `DATABASE_URL`: (Neon connection string)
     - `BETTER_AUTH_SECRET`: (same as local)
     - `CORS_ORIGINS`: (Vercel frontend URL)

7. Access backend at: `https://YOUR_USERNAME-todo-app-backend.hf.space`

**Acceptance Criteria:**
- [ ] Backend deployed and accessible via public URL
- [ ] Health endpoint returns 200 OK: GET https://backend-url/health
- [ ] Environment variables configured correctly
- [ ] CORS allows Vercel frontend origin
- [ ] Database connection working (test with API call)
- [ ] Logs visible in deployment platform dashboard (Railway/HF Spaces)
- [ ] For HF Spaces: Port 7860 is used and app is publicly accessible

---

### T024: Deploy Frontend to Vercel
**Category:** Deployment
**Size:** M
**Dependencies:** T018, T023
**Spec Reference:** plan.md §8.1, constitution.md §Deployment Requirements

**Description:**
Deploy Next.js frontend to Vercel with environment variables.

**Implementation Steps:**
1. Create Vercel account
2. Import GitHub repository
3. Configure Vercel project:
   - Root directory: `/frontend`
   - Framework preset: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`

4. Set environment variables in Vercel dashboard:
   - NEXT_PUBLIC_API_URL: (Railway backend URL)
   - NEXT_PUBLIC_BETTER_AUTH_SECRET: (same as backend)

5. Deploy and test production URL

**Acceptance Criteria:**
- [ ] Frontend deployed and accessible via public URL
- [ ] Environment variables configured correctly
- [ ] Can sign up, sign in, and manage tasks on production
- [ ] API requests go to Railway backend (verify in Network tab)
- [ ] No console errors in production
- [ ] HTTPS enabled automatically (Vercel default)

---

### T025: Configure Production CORS and Security
**Category:** Deployment
**Size:** S
**Dependencies:** T023, T024
**Spec Reference:** constitution.md §Security Constraints, plan.md §5.3

**Description:**
Update backend CORS settings and verify production security.

**Implementation Steps:**
1. Update CORS_ORIGINS in Railway:
   ```
   CORS_ORIGINS=https://your-app.vercel.app
   ```
   (Remove localhost from production)

2. Verify JWT tokens working in production:
   - Sign up → token issued
   - Sign in → token issued
   - API calls → token verified

3. Run security checklist:
   - [ ] HTTPS enforced on frontend and backend
   - [ ] CORS restricted to Vercel URL
   - [ ] No secrets committed to Git
   - [ ] Database connection string not exposed
   - [ ] Error messages don't leak internals

**Acceptance Criteria:**
- [ ] CORS only allows Vercel frontend URL
- [ ] API rejects requests from unknown origins
- [ ] JWT authentication working end-to-end in production
- [ ] All security checklist items verified
- [ ] No secrets in Git history

---

## Phase 6: Documentation and Submission

### T026: Create Comprehensive README
**Category:** Documentation
**Size:** M
**Dependencies:** T025
**Spec Reference:** spec.md §11, constitution.md §Success Criteria

**Description:**
Write detailed README with setup instructions, architecture overview, and deployment guide.

**Implementation Steps:**
1. Create README.md in root directory with sections:
   - Project Title and Description
   - Phase II Overview
   - Technology Stack
   - Project Structure (monorepo layout)
   - Local Development Setup
     - Prerequisites (Node.js, Python, UV, Neon account)
     - Backend setup steps
     - Frontend setup steps
     - Environment variables
     - Running locally
   - Deployment Guide
     - Neon database setup
     - Railway backend deployment
     - Vercel frontend deployment
   - API Documentation (link to spec.md §7.2 or inline)
   - Testing Instructions
   - Spec-Driven Development Process (reference constitution, spec, plan, tasks)
   - Demo Video Link
   - Submission Information
   - License

**Acceptance Criteria:**
- [ ] README covers all required sections
- [ ] Setup instructions tested by following step-by-step
- [ ] Links to spec files and demo video included
- [ ] Badges (optional): build status, license
- [ ] Screenshots of app (optional but recommended)
- [ ] Clear, professional writing

---

### T027: Record Demo Video (Under 90 Seconds)
**Category:** Documentation
**Size:** S
**Dependencies:** T025
**Spec Reference:** spec.md §11, hackathon rules

**Description:**
Record a concise demo video showing all Phase II features.

**Implementation Steps:**
1. Script the demo (stay under 90 seconds):
   - [0-10s] Intro: "Phase II Full-Stack Todo App"
   - [10-20s] Sign up new user
   - [20-35s] Create 2 tasks
   - [35-45s] Mark task complete (show visual change)
   - [45-55s] Edit task
   - [55-65s] Delete task
   - [65-75s] Logout and sign in again (show persistence)
   - [75-85s] Show responsive design (resize browser or show mobile)
   - [85-90s] Mention spec-driven development process, thank you

2. Record screen with audio narration (use OBS, Loom, or NotebookLM)
3. Upload to YouTube (unlisted) or Google Drive
4. Test video plays correctly and is under 90 seconds

**Acceptance Criteria:**
- [ ] Video demonstrates all 5 Basic Level features
- [ ] Video shows authentication (signup, signin, logout)
- [ ] Video shows multi-user data isolation (optional: demo 2 users)
- [ ] Video shows responsive design
- [ ] Video mentions spec-driven development
- [ ] Video is under 90 seconds (judges only watch first 90s)
- [ ] Video has clear audio and visual quality
- [ ] Video uploaded and link accessible

---

### T028: Final Submission Checklist
**Category:** Documentation
**Size:** XS
**Dependencies:** T026, T027
**Spec Reference:** spec.md §11

**Description:**
Complete final submission checklist and submit via Google Form.

**Implementation Steps:**
1. Verify all deliverables:
   - [ ] Public GitHub repository
   - [ ] Constitution, spec, plan, tasks files in /specs/phase-ii-fullstack/
   - [ ] All code in /frontend and /backend
   - [ ] README.md with setup instructions
   - [ ] .env.example files (not .env)
   - [ ] Demo video link in README
   - [ ] Frontend deployed on Vercel (link in README)
   - [ ] Backend deployed on Railway (link in README)
   - [ ] All 5 Basic Level features working
   - [ ] Authentication working
   - [ ] No manual coding artifacts (all via Claude Code)

2. Submit via form: https://forms.gle/KMKEKaFUD6ZX4UtY8
   - GitHub repository URL
   - Vercel frontend URL
   - Demo video link (under 90 seconds)
   - WhatsApp number (for presentation invitation)

3. Double-check submission received

**Acceptance Criteria:**
- [ ] All checklist items verified
- [ ] GitHub repository public and accessible
- [ ] Demo video accessible and under 90 seconds
- [ ] Submission form completed and submitted
- [ ] Confirmation received (check email/form response)

---

## Phase 7: Bonus Features (Optional)

### T029: [BONUS] Implement Reusable Intelligence Artifacts
**Category:** Bonus
**Size:** L
**Dependencies:** T028
**Spec Reference:** constitution.md §Bonus Points, spec.md §9.1

**Description:**
Create Claude Code Subagents and Agent Skills for reusable intelligence (+200 points).

**Implementation Steps:**
1. Identify repetitive tasks in Phase II implementation
2. Create custom Subagent for API endpoint generation:
   - Takes model definition + CRUD operations spec
   - Generates routes, service layer, tests

3. Create Agent Skill for authentication middleware setup:
   - Generates JWT middleware
   - Creates auth dependencies
   - Generates tests

4. Document skills in /skills directory with:
   - Purpose and use cases
   - Input requirements
   - Output artifacts
   - Usage examples

5. Test skills by using them to regenerate Phase II components

**Acceptance Criteria:**
- [ ] At least 1 Subagent created and documented
- [ ] At least 1 Agent Skill created and documented
- [ ] Skills packaged for reuse (clear instructions)
- [ ] Skills tested and working
- [ ] Documentation in repository (/skills/README.md)
- [ ] Examples of skill usage provided
- [ ] Submission mentions bonus features in demo video

**Bonus Points:** +200

---

### T030: [BONUS] Implement Urdu Language Support
**Category:** Bonus
**Size:** M
**Dependencies:** T028
**Spec Reference:** constitution.md §Bonus Points, spec.md §9.2

**Description:**
Add multi-language support with Urdu as second language (+100 points).

**Implementation Steps:**
1. Install i18n library: `npm install next-intl`
2. Create translation files:
   - frontend/locales/en.json (English strings)
   - frontend/locales/ur.json (Urdu translations)

3. Add language toggle button in UI (EN ↔ UR)
4. Configure RTL support for Urdu:
   - Add `dir="rtl"` to html tag when Urdu selected
   - Adjust Tailwind CSS for RTL layout

5. Load Urdu font (Noto Nastaliq Urdu):
   - Add to next.config.js
   - Apply font-family when Urdu selected

6. Translate all user-facing strings:
   - Form labels and placeholders
   - Button text
   - Error messages
   - Empty states
   - Navigation

**Acceptance Criteria:**
- [ ] Language toggle button visible in UI
- [ ] Clicking toggle switches between English and Urdu
- [ ] All UI text translates correctly
- [ ] RTL layout works correctly for Urdu
- [ ] Urdu font renders properly
- [ ] Language preference persisted in localStorage
- [ ] Demo video shows language switching
- [ ] Submission mentions bonus features

**Bonus Points:** +100

---

## Task Summary

| Phase | Task Count | Total Size |
|-------|------------|------------|
| Phase 1: Setup | 5 tasks | 2M, 2S, 1XS |
| Phase 2: Backend | 6 tasks | 2L, 3M, 1S |
| Phase 3: Frontend | 7 tasks | 3L, 3M, 1XS |
| Phase 4: Integration & Testing | 4 tasks | 2L, 2M |
| Phase 5: Deployment | 3 tasks | 2M, 1S |
| Phase 6: Documentation | 3 tasks | 1M, 1S, 1XS |
| Phase 7: Bonus | 2 tasks | 1L, 1M |
| **Total** | **30 tasks** | **8L, 11M, 6S, 3XS** |

**Estimated Effort:**
- Core Features (T001-T028): 10-12 days (with Claude Code assistance)
- Bonus Features (T029-T030): 2-3 additional days

**Critical Path:**
T001 → T002/T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010 → T011 → T012 → T013 → T014 → T015 → T019 → T020/T021 → T023 → T024 → T025 → T026 → T027 → T028

---

**Tasks Version:** 1.0.0
**Last Updated:** 2025-12-29
**Status:** Ready for Implementation via Claude Code
**Next Action:** Begin implementation with T001 (Initialize Monorepo Structure)
