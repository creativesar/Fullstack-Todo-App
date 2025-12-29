# Phase II - Todo Full-Stack Web Application Specification

**Version:** 1.0.0
**Phase:** Phase II of Hackathon Evolution of Todo
**Status:** Planning
**Target Completion:** December 14, 2025
**Points:** 150 + Bonus Points

## 1. Executive Summary

Transform the Phase I console todo application into a modern, multi-user web application with persistent storage, user authentication, and a responsive interface. This phase establishes the foundation for future AI-powered features by creating a secure, scalable full-stack architecture.

## Clarifications

### Session 2025-12-29
- Q: When a user clicks the delete button for a task, should the system require confirmation before permanently deleting? → A: Simple browser confirm dialog ("Are you sure you want to delete this task?")
- Q: Where should the JWT token be stored in the browser after successful authentication? → A: localStorage (simpler for Phase II MVP, requires HTTPS in production)
- Q: Which cloud platform should be used for deploying the FastAPI backend in Phase II? → A: Railway (best balance of features, free tier, and PostgreSQL support)
- Q: What should the UI display when a user has no tasks in their list? → A: Friendly message with action prompt: "No tasks yet. Click 'Add Task' to get started!"
- Q: How should completed tasks be visually distinguished from pending tasks in the UI? → A: Strikethrough text with muted gray color (text-gray-500 or #6B7280)

## 2. Project Context

### 2.1 Background
This is Phase II of the 5-phase "Evolution of Todo" hackathon project. Phase I delivered an in-memory Python console app. Phase II evolves this into a production-ready web application with authentication and database persistence.

### 2.2 Success Criteria
- **Functional:** All 5 Basic Level todo features working in web interface
- **Technical:** Multi-user support with JWT-based authentication
- **Deployment:** Live application on Vercel (frontend) and cloud backend
- **Documentation:** Complete spec-driven development artifacts
- **Points:** 150 points + optional bonus points

### 2.3 Constraints
- **No Manual Coding:** All code generated via Claude Code with spec refinement
- **Technology Stack:** Frozen to Next.js 16+, FastAPI, SQLModel, Neon PostgreSQL
- **Security:** JWT-based authentication with Better Auth (no passwords in custom code)
- **Timeline:** Due December 14, 2025

## 3. User Stories

### 3.1 Authentication Stories

#### US-1: User Signup
**As a** new user
**I want to** create an account with email and password
**So that** I can access my personal todo list

**Acceptance Criteria:**
- ✅ Signup form with email and password fields
- ✅ Password meets minimum security requirements (8+ chars)
- ✅ Email validation before submission
- ✅ Error messages for duplicate email or weak password
- ✅ Automatic login after successful signup
- ✅ JWT token stored in localStorage with key "auth_token"
- ✅ Redirect to todo list page after signup

#### US-2: User Signin
**As a** returning user
**I want to** log in with my email and password
**So that** I can access my saved tasks

**Acceptance Criteria:**
- ✅ Signin form with email and password fields
- ✅ Error message for incorrect credentials
- ✅ JWT token issued on successful login
- ✅ Token included in all subsequent API requests
- ✅ Redirect to todo list page after signin
- ✅ "Remember me" option (optional)

#### US-3: User Logout
**As a** logged-in user
**I want to** log out of my account
**So that** others cannot access my tasks on shared devices

**Acceptance Criteria:**
- ✅ Logout button visible when authenticated
- ✅ Token removed from localStorage (key "auth_token")
- ✅ Redirect to landing page after logout
- ✅ Cannot access protected routes after logout

### 3.2 Task Management Stories

#### US-4: Add Task
**As a** user
**I want to** create a new task with a title and optional description
**So that** I can track things I need to do

**Acceptance Criteria:**
- ✅ "Add Task" button or form visible on main page
- ✅ Title field (required, 1-200 characters)
- ✅ Description field (optional, max 1000 characters)
- ✅ "Save" button creates task and adds to list
- ✅ Task appears immediately in list after creation
- ✅ Task is associated with logged-in user
- ✅ Empty title shows validation error
- ✅ Success feedback after task creation

**API Endpoint:**
```
POST /api/{user_id}/tasks
Body: {"title": "string", "description": "string"}
Response: {"id": int, "title": "string", "description": "string", "completed": false, "created_at": "ISO8601", "updated_at": "ISO8601"}
Status: 201 Created
```

#### US-5: View Task List
**As a** user
**I want to** see all my tasks in a list
**So that** I can review what I need to do

**Acceptance Criteria:**
- ✅ All user's tasks displayed on main page
- ✅ Each task shows: title, completion status, created date
- ✅ Tasks ordered by created date (newest first)
- ✅ Empty state message: "No tasks yet. Click 'Add Task' to get started!"
- ✅ Visual distinction between completed and pending tasks
- ✅ Only shows tasks belonging to authenticated user
- ✅ List updates automatically after any task operation

**API Endpoint:**
```
GET /api/{user_id}/tasks
Response: [{"id": int, "title": "string", "description": "string", "completed": bool, "created_at": "ISO8601", "updated_at": "ISO8601"}, ...]
Status: 200 OK
```

#### US-6: Update Task
**As a** user
**I want to** edit a task's title or description
**So that** I can correct mistakes or add more details

**Acceptance Criteria:**
- ✅ Edit button/icon visible for each task
- ✅ Clicking edit opens form with current values
- ✅ Can modify title and/or description
- ✅ "Save" button updates task in database
- ✅ "Cancel" button discards changes
- ✅ Updated task reflects changes immediately
- ✅ Validation prevents empty title
- ✅ Cannot edit other users' tasks

**API Endpoint:**
```
PUT /api/{user_id}/tasks/{id}
Body: {"title": "string", "description": "string"}
Response: {"id": int, "title": "string", "description": "string", "completed": bool, "updated_at": "ISO8601"}
Status: 200 OK
```

#### US-7: Delete Task
**As a** user
**I want to** remove a task from my list
**So that** I can keep my list clean and relevant

**Acceptance Criteria:**
- ✅ Delete button/icon visible for each task
- ✅ Browser confirm dialog displayed: "Are you sure you want to delete this task?"
- ✅ Task removed from list immediately after user confirms
- ✅ Task permanently deleted from database after confirmation
- ✅ Cannot delete other users' tasks
- ✅ No action taken if user cancels the confirmation

**API Endpoint:**
```
DELETE /api/{user_id}/tasks/{id}
Response: {"message": "Task deleted successfully"}
Status: 200 OK
```

#### US-8: Mark Task Complete/Incomplete
**As a** user
**I want to** toggle a task's completion status
**So that** I can track my progress

**Acceptance Criteria:**
- ✅ Checkbox or toggle button for each task
- ✅ Clicking toggles between complete and incomplete
- ✅ Visual change reflects new status immediately (strikethrough + gray color)
- ✅ Status persisted to database
- ✅ Can toggle status multiple times
- ✅ Cannot toggle other users' tasks
- ✅ Completed tasks styled with strikethrough text and muted gray color (Tailwind: line-through text-gray-500)

**API Endpoint:**
```
PATCH /api/{user_id}/tasks/{id}/complete
Response: {"id": int, "completed": bool, "updated_at": "ISO8601"}
Status: 200 OK
```

## 4. Functional Requirements

### 4.1 Authentication & Authorization

#### FR-1: User Registration
- System must allow new users to register with email and password
- Email must be unique across all users
- Password must be at least 8 characters
- Better Auth manages password hashing and storage
- JWT token issued immediately after registration
- Token expiration set to 7 days

#### FR-2: User Login
- System must authenticate users with email/password credentials
- Invalid credentials return 401 Unauthorized
- Valid credentials return JWT token
- Token includes user_id in payload
- Token signed with BETTER_AUTH_SECRET

#### FR-3: Token Verification
- All task API endpoints require valid JWT token
- Token passed in Authorization header: `Bearer <token>`
- Backend verifies token signature using BETTER_AUTH_SECRET
- Expired or invalid tokens return 401 Unauthorized
- User_id extracted from verified token

#### FR-4: User Data Isolation
- Each user only accesses their own tasks
- API filters all queries by authenticated user_id
- User_id in URL path must match token user_id
- Cross-user access attempts return 403 Forbidden

### 4.2 Task Management

#### FR-5: Create Task
- User can create task with title (required) and description (optional)
- Title length: 1-200 characters
- Description length: 0-1000 characters
- Task automatically associated with authenticated user
- Task created with completed=false by default
- Timestamps (created_at, updated_at) automatically set

#### FR-6: Read Tasks
- User can retrieve all their tasks
- Tasks returned in JSON array format
- Each task includes: id, title, description, completed, created_at, updated_at
- Tasks ordered by created_at descending (newest first)
- Empty array returned if user has no tasks

#### FR-7: Update Task
- User can update title and/or description of their tasks
- Cannot update other users' tasks
- Updated_at timestamp automatically updated
- Completed status not changed by this operation
- Returns updated task object

#### FR-8: Delete Task
- User can permanently delete their tasks
- Cannot delete other users' tasks
- Task removed from database immediately
- Returns success message

#### FR-9: Toggle Completion Status
- User can mark task as complete or incomplete
- Toggle operation switches boolean state
- Cannot toggle other users' tasks
- Updated_at timestamp automatically updated
- Returns updated task object with new status

### 4.3 User Interface

#### FR-10: Responsive Design
- UI must work on desktop (1024px+), tablet (768px+), and mobile (375px+)
- Single-column layout on mobile
- Multi-column possible on desktop
- Touch-friendly buttons and controls (44px+ touch targets)
- Readable font sizes on all devices

#### FR-11: Visual Feedback
- Loading states for async operations
- Success messages for create/update/delete operations
- Error messages displayed clearly
- Completed tasks visually distinguished with strikethrough text and muted gray color (#6B7280)
- Hover states for interactive elements

#### FR-12: Accessibility
- Semantic HTML elements
- Proper heading hierarchy
- ARIA labels for icon buttons
- Keyboard navigation support
- Focus indicators visible
- Color contrast meets WCAG AA standards

## 5. Non-Functional Requirements

### 5.1 Performance

#### NFR-1: API Response Time
- 95th percentile response time < 200ms for task operations
- Database queries optimized with indexes on user_id and id
- Connection pooling enabled for database
- Async/await for all I/O operations

#### NFR-2: Frontend Performance
- First Contentful Paint < 1.5 seconds
- Time to Interactive < 3 seconds
- Lazy loading for non-critical components
- Code splitting by route

### 5.2 Security

#### NFR-3: Authentication Security
- Passwords never stored in plaintext (delegated to Better Auth)
- JWT tokens signed with strong secret (min 32 characters)
- Tokens expire after 7 days
- HTTPS required in production
- CORS restricted to known origins

#### NFR-4: Data Security
- SQL injection prevented by SQLModel parameterization
- XSS prevented by React's default escaping
- No sensitive data in client-side logs
- Secrets stored in environment variables only
- JWT token stored in localStorage (acceptable for Phase II with HTTPS enforcement; httpOnly cookies deferred to future phases for simplicity)

### 5.3 Reliability

#### NFR-5: Error Handling
- All API errors return consistent JSON format: `{"detail": "message"}`
- Proper HTTP status codes (401, 403, 404, 500)
- Frontend displays user-friendly error messages
- Backend logs errors with context

#### NFR-6: Data Integrity
- Database constraints enforce data validity
- Foreign keys maintain referential integrity
- Timestamps in UTC to avoid timezone issues
- Transactions for multi-step operations

### 5.4 Scalability

#### NFR-7: Stateless Architecture
- No server-side session storage
- Any backend instance can handle any request
- Horizontal scaling possible
- Database is bottleneck (acceptable for Phase II)

### 5.5 Maintainability

#### NFR-8: Code Quality
- TypeScript strict mode on frontend
- Python type hints on backend
- Clear separation of concerns (routes, models, db, services)
- Consistent naming conventions
- Comprehensive error messages

#### NFR-9: Testing
- Unit tests for business logic
- Integration tests for API endpoints
- Minimum 70% code coverage on backend
- Frontend component tests for critical UI

## 6. Data Model

### 6.1 Database Schema

#### Table: users
Managed by Better Auth. We reference this table but do not directly modify it.

```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Table: tasks

```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
```

### 6.2 SQLModel Models

#### Task Model
```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=200)
    description: Optional[str] = None
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

## 7. API Specification

### 7.1 Authentication Header
All task endpoints require:
```
Authorization: Bearer <jwt_token>
```

### 7.2 Endpoints

#### GET /api/{user_id}/tasks
**Description:** Retrieve all tasks for authenticated user

**Path Parameters:**
- `user_id` (string, required): User identifier

**Query Parameters:** None

**Response (200 OK):**
```json
[
    {
        "id": 1,
        "title": "Buy groceries",
        "description": "Milk, eggs, bread",
        "completed": false,
        "created_at": "2025-12-29T10:00:00Z",
        "updated_at": "2025-12-29T10:00:00Z"
    },
    {
        "id": 2,
        "title": "Finish hackathon",
        "description": null,
        "completed": true,
        "created_at": "2025-12-28T09:00:00Z",
        "updated_at": "2025-12-29T11:00:00Z"
    }
]
```

**Errors:**
- 401 Unauthorized: Invalid or missing token
- 403 Forbidden: user_id in URL doesn't match token

---

#### POST /api/{user_id}/tasks
**Description:** Create a new task

**Path Parameters:**
- `user_id` (string, required): User identifier

**Request Body:**
```json
{
    "title": "Task title",
    "description": "Optional description"
}
```

**Response (201 Created):**
```json
{
    "id": 3,
    "title": "Task title",
    "description": "Optional description",
    "completed": false,
    "created_at": "2025-12-29T12:00:00Z",
    "updated_at": "2025-12-29T12:00:00Z"
}
```

**Errors:**
- 400 Bad Request: Missing title or validation error
- 401 Unauthorized: Invalid or missing token
- 403 Forbidden: user_id in URL doesn't match token

---

#### GET /api/{user_id}/tasks/{id}
**Description:** Retrieve single task by ID

**Path Parameters:**
- `user_id` (string, required): User identifier
- `id` (integer, required): Task identifier

**Response (200 OK):**
```json
{
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "created_at": "2025-12-29T10:00:00Z",
    "updated_at": "2025-12-29T10:00:00Z"
}
```

**Errors:**
- 401 Unauthorized: Invalid or missing token
- 403 Forbidden: Task belongs to different user
- 404 Not Found: Task doesn't exist

---

#### PUT /api/{user_id}/tasks/{id}
**Description:** Update task title and/or description

**Path Parameters:**
- `user_id` (string, required): User identifier
- `id` (integer, required): Task identifier

**Request Body:**
```json
{
    "title": "Updated title",
    "description": "Updated description"
}
```

**Response (200 OK):**
```json
{
    "id": 1,
    "title": "Updated title",
    "description": "Updated description",
    "completed": false,
    "created_at": "2025-12-29T10:00:00Z",
    "updated_at": "2025-12-29T13:00:00Z"
}
```

**Errors:**
- 400 Bad Request: Validation error
- 401 Unauthorized: Invalid or missing token
- 403 Forbidden: Task belongs to different user
- 404 Not Found: Task doesn't exist

---

#### DELETE /api/{user_id}/tasks/{id}
**Description:** Delete a task permanently

**Path Parameters:**
- `user_id` (string, required): User identifier
- `id` (integer, required): Task identifier

**Response (200 OK):**
```json
{
    "message": "Task deleted successfully"
}
```

**Errors:**
- 401 Unauthorized: Invalid or missing token
- 403 Forbidden: Task belongs to different user
- 404 Not Found: Task doesn't exist

---

#### PATCH /api/{user_id}/tasks/{id}/complete
**Description:** Toggle task completion status

**Path Parameters:**
- `user_id` (string, required): User identifier
- `id` (integer, required): Task identifier

**Request Body:** None (or optionally `{"completed": true/false}`)

**Response (200 OK):**
```json
{
    "id": 1,
    "completed": true,
    "updated_at": "2025-12-29T14:00:00Z"
}
```

**Errors:**
- 401 Unauthorized: Invalid or missing token
- 403 Forbidden: Task belongs to different user
- 404 Not Found: Task doesn't exist

## 8. Technology Stack

### 8.1 Frontend
- **Framework:** Next.js 16+ with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Authentication:** Better Auth (client-side integration)
- **HTTP Client:** Native fetch API
- **State Management:** React state + Server Components

### 8.2 Backend
- **Framework:** FastAPI (Python)
- **ORM:** SQLModel
- **Validation:** Pydantic models
- **Authentication:** JWT verification (shared secret with Better Auth)
- **Database Driver:** asyncpg (via SQLModel)

### 8.3 Database
- **Service:** Neon Serverless PostgreSQL
- **Connection:** asyncpg connection pool
- **Migrations:** Alembic (optional) or manual SQL scripts

### 8.4 Deployment
- **Frontend:** Vercel
- **Backend:** Railway
- **Database:** Neon (hosted)

## 9. Bonus Features (Optional)

### 9.1 Reusable Intelligence (+200 points)

#### Objective
Create reusable Claude Code Subagents and Agent Skills that can be shared and reused across projects.

#### Requirements
- ✅ At least one custom Subagent for common task (e.g., "API endpoint generator")
- ✅ At least one Agent Skill for pattern implementation (e.g., "CRUD operations skill")
- ✅ Documentation in repository explaining usage
- ✅ Skills packaged for reuse in future phases

#### Examples
- Subagent that generates boilerplate API endpoint with tests
- Skill that implements authentication middleware
- Skill that sets up database models with proper indexes

### 9.2 Multi-language Support - Urdu (+100 points)

#### Objective
Support Urdu language in the UI with proper RTL rendering and font support.

#### Requirements
- ✅ Language toggle in UI (English ↔ Urdu)
- ✅ All user-facing text translatable
- ✅ Right-to-left (RTL) layout for Urdu
- ✅ Proper Urdu font (Noto Nastaliq Urdu or similar)
- ✅ Language preference persisted in browser storage

#### Implementation Approach
- Use i18n library (next-intl or similar)
- JSON files for translations (en.json, ur.json)
- CSS direction handling (dir="rtl")
- Font loading for Urdu script

## 10. Out of Scope

The following are explicitly NOT part of Phase II:

- ❌ Chatbot interface (Phase III)
- ❌ MCP server (Phase III)
- ❌ OpenAI Agents SDK integration (Phase III)
- ❌ Kubernetes deployment (Phase IV)
- ❌ Kafka messaging (Phase V)
- ❌ Dapr integration (Phase V)
- ❌ Advanced features: recurring tasks, reminders, due dates (Phase V)
- ❌ Intermediate features: priorities, tags, categories, search, filter, sort (Phase V)
- ❌ Real-time collaboration
- ❌ Offline support
- ❌ Task sharing between users
- ❌ Email notifications

## 11. Acceptance Criteria Summary

### Phase II is complete when:

1. ✅ All 5 Basic Level features functional in web UI
2. ✅ User authentication (signup/signin/logout) working
3. ✅ Multi-user support with proper data isolation
4. ✅ All 6 API endpoints implemented and tested
5. ✅ JWT authentication working end-to-end
6. ✅ Frontend deployed on Vercel and accessible
7. ✅ Backend API deployed and accessible
8. ✅ Database connected and operational
9. ✅ Responsive UI working on mobile and desktop
10. ✅ Public GitHub repository with all code
11. ✅ Constitution, spec, plan, tasks files present
12. ✅ Demo video under 90 seconds uploaded
13. ✅ README with setup instructions complete
14. ✅ All acceptance criteria in user stories validated

### Optional Bonus Criteria:
- ✅ Reusable Intelligence artifacts documented (+200 points)
- ✅ Urdu language support implemented (+100 points)

## 12. Risks and Mitigations

### Risk 1: Better Auth Integration Complexity
**Impact:** High
**Likelihood:** Medium
**Mitigation:** Study Better Auth documentation thoroughly. Use official examples. Test JWT token flow early. Create fallback authentication if Better Auth blocks progress.

### Risk 2: JWT Token Synchronization
**Impact:** High
**Likelihood:** Medium
**Mitigation:** Ensure BETTER_AUTH_SECRET is identical on frontend and backend. Test token verification early. Document token flow clearly.

### Risk 3: Database Connection Issues
**Impact:** High
**Likelihood:** Low
**Mitigation:** Test Neon connection in isolation first. Use connection pooling. Implement retry logic. Have local PostgreSQL backup option.

### Risk 4: Deployment Complications
**Impact:** Medium
**Likelihood:** Medium
**Mitigation:** Deploy early and often. Test in production-like environment. Document deployment steps. Use Docker for consistent environments.

### Risk 5: Time Pressure
**Impact:** High
**Likelihood:** High
**Mitigation:** Prioritize core features over bonus features. Use Claude Code effectively with clear specs. Don't perfectionism block progress. Submit working MVP even if not all bonuses complete.

## 13. Dependencies

### External Dependencies
- Neon PostgreSQL account and database
- Vercel account for frontend deployment
- Railway account for backend deployment
- Claude Code access for implementation
- Better Auth installation and configuration

### Internal Dependencies
- Phase I completion (understanding of basic todo features)
- Constitution.md finalized and approved
- This spec.md approved by user
- plan.md completed before implementation
- tasks.md generated from plan before coding

## 14. Timeline

**Start Date:** December 1, 2025
**Submission Deadline:** December 14, 2025
**Presentation:** December 14, 2025, 8:00 PM (if invited)

**Recommended Milestones:**
- Day 1-2: Finalize constitution, spec, plan, tasks
- Day 3-4: Setup projects (frontend, backend, database)
- Day 5-7: Implement backend API and database models
- Day 8-10: Implement frontend UI and authentication
- Day 11-12: Integration testing and bug fixes
- Day 13: Deployment to production
- Day 14: Demo video and submission

## 15. Success Metrics

### Functional Success
- All 5 Basic Level features work correctly
- Authentication flow works end-to-end
- Multi-user data isolation verified
- No cross-user data leaks

### Technical Success
- API response times < 200ms (p95)
- Zero manual coding (all via Claude Code)
- Test coverage > 70% on backend
- No critical security vulnerabilities

### Process Success
- Spec-driven development process documented
- All required artifacts present in repository
- Constitution, spec, plan, tasks files complete
- Iterative refinement process demonstrated

### Deployment Success
- Frontend accessible on Vercel
- Backend API accessible and functional
- Database queries working
- Demo video under 90 seconds uploaded

---

**Document Version:** 1.0.0
**Last Updated:** 2025-12-29
**Next Review:** After user approval, proceed to plan.md
