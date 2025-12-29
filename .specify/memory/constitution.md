# Todo Full-Stack Application Constitution

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)
**NO CODE WITHOUT SPEC**: Every feature must have a specification before implementation. All code generated through Claude Code using refined specifications. Specs are iteratively refined until Claude Code generates correct output. All implementations must trace back to spec.md requirements.

### II. Stateless Architecture
**JWT-Based Authentication**: No server-side sessions. All authentication via JWT tokens. User data filtered by authenticated user ID. API endpoints are stateless and horizontally scalable. Backend verifies tokens with shared BETTER_AUTH_SECRET.

### III. Security First (NON-NEGOTIABLE)
**User Isolation**: All API endpoints require valid JWT token. Each user only sees/modifies their own data. No hardcoded secrets (use .env files). Input validation mandatory before database operations. SQL injection prevented by SQLModel parameterization.

### IV. Type Safety
**TypeScript + Python Type Hints**: Frontend uses TypeScript strict mode. Backend uses type hints for all functions. Pydantic models for request/response validation. SQLModel for type-safe ORM operations. No `any` types without justification.

### V. Separation of Concerns
**Clear Boundaries**: Frontend (Next.js App Router) handles presentation and client state. Backend (FastAPI) handles business logic and data access. Database (Neon PostgreSQL) manages persistence. Better Auth manages authentication. No business logic in UI components.

### VI. Performance Standards
**Response Time**: API endpoints < 200ms (p95). Database queries optimized with indexes. Connection pooling enabled. Async operations for I/O. Pagination for list endpoints. Frontend FCP < 1.5s, TTI < 3s.

### VII. Testing Requirements
**Test Coverage**: Minimum 70% coverage for backend. Unit tests for business logic. Integration tests for API endpoints. Frontend component tests. Mock external dependencies. Database transaction rollback in tests.

## Technology Stack (Non-Negotiable)

### Frontend
- Next.js 16+ with App Router (NOT Pages Router)
- TypeScript with strict mode
- Server Components by default
- Client Components only when interactivity needed
- Tailwind CSS (no inline styles)
- Better Auth for authentication
- Centralized API client in `/lib/api.ts`

### Backend
- Python FastAPI with async/await
- SQLModel for ORM
- Pydantic models for validation
- HTTPException for error handling
- JWT middleware for authentication
- UV for package management

### Database
- Neon Serverless PostgreSQL
- SQLModel models with type annotations
- Foreign keys explicitly defined
- Indexes on user_id and status fields
- UTC timestamps for datetime fields
- Migration scripts for schema changes

### Development Tools
- Claude Code for implementation
- Spec-Kit Plus for specifications
- Git for version control
- WSL 2 for Windows users
- Docker for containerization

## API Design Standards

### RESTful Conventions
- GET: retrieval
- POST: creation (returns 201)
- PUT: full updates
- PATCH: partial updates
- DELETE: removal
- Proper status codes: 200, 201, 400, 401, 404, 500

### Request/Response Format
- JSON for all requests/responses
- Consistent error format: `{"detail": "error message"}`
- ISO 8601 for datetime fields
- User ID in URL path: `/api/{user_id}/tasks`
- Authorization header: `Authorization: Bearer <token>`

### Endpoints Required
```
GET    /api/{user_id}/tasks           - List all tasks
POST   /api/{user_id}/tasks           - Create task
GET    /api/{user_id}/tasks/{id}      - Get task details
PUT    /api/{user_id}/tasks/{id}      - Update task
DELETE /api/{user_id}/tasks/{id}      - Delete task
PATCH  /api/{user_id}/tasks/{id}/complete - Toggle completion
```

## Code Quality Standards

### Frontend Standards
- TypeScript strict mode enabled
- Server Components by default
- No prop drilling
- Async/await for API calls
- Proper error boundaries
- Component reusability in `/components`
- Accessibility attributes (aria-*)

### Backend Standards
- Type hints for all parameters/returns
- Async/await for database operations
- Clear separation: routes, models, db, services
- Comprehensive error messages
- No raw SQL (use SQLModel)
- Logging for errors and key operations

### Database Standards
- SQLModel models only
- Explicit foreign key relationships
- Indexes on frequently queried fields
- UTC timestamps (not local time)
- No nullable foreign keys without reason
- Migration scripts for all schema changes

## Security Constraints

### Authentication Flow
1. Better Auth issues JWT token on frontend
2. Frontend includes token in `Authorization: Bearer <token>` header
3. Backend verifies token using BETTER_AUTH_SECRET
4. Backend extracts user_id from verified token
5. Backend filters all data by authenticated user_id
6. User_id in URL must match token user_id

### Data Protection
- User data isolated by user_id
- No cross-user data access
- XSS prevented by framework defaults
- CORS configured for known origins only
- Secrets in .env files (never committed)
- .env.example with placeholder values

### Forbidden Practices
❌ Hardcoding secrets or API keys
❌ Storing passwords (use Better Auth)
❌ Server-side sessions
❌ Raw SQL queries
❌ Cross-user data access
❌ Unvalidated user inputs
❌ Inline styles
❌ Manual coding without spec refinement

## Monorepo Structure (Non-Negotiable)

```
hackathon-todo/
├── .specify/
│   ├── memory/
│   │   └── constitution.md
│   ├── templates/
│   └── scripts/
├── specs/
│   └── phase-ii-fullstack/
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
├── history/
│   ├── prompts/
│   └── adr/
├── CLAUDE.md
├── frontend/
│   ├── CLAUDE.md
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
├── backend/
│   ├── CLAUDE.md
│   ├── main.py
│   ├── models.py
│   ├── routes/
│   └── pyproject.toml
├── docker-compose.yml
└── README.md
```

## Development Workflow (Mandatory)

1. **Specification First**: Write spec.md with requirements
2. **Architecture Planning**: Create plan.md with technical approach
3. **Task Breakdown**: Generate tasks.md with atomic, testable tasks
4. **Implementation via Claude Code**: Refine specs until correct code generation
5. **Testing**: Validate acceptance criteria for each task
6. **Integration**: Ensure frontend/backend work together
7. **Documentation**: Update README and deployment docs

## Phase II Success Criteria

### Functional Requirements (150 points)
✅ All 5 Basic Level features implemented:
  - Add Task (title, description)
  - Delete Task
  - Update Task
  - View Task List
  - Mark as Complete/Incomplete

✅ Multi-user authentication with Better Auth
✅ User signup and signin
✅ RESTful API endpoints functional
✅ Responsive UI (mobile and desktop)
✅ Data persistence in Neon PostgreSQL

### Technical Requirements
✅ Spec-driven development documented
✅ Constitution, spec, plan, tasks files present
✅ JWT authentication end-to-end
✅ Database schema with proper indexes
✅ No manual coding artifacts
✅ Monorepo structure with Spec-Kit Plus

### Deployment Requirements
✅ Frontend deployed on Vercel
✅ Backend API accessible and documented
✅ Database connected and operational
✅ Demo video under 90 seconds
✅ Public GitHub repository with all artifacts

### Bonus Points Opportunities

**Reusable Intelligence (+200 points)**
- Create Claude Code Subagents for repetitive tasks
- Build Agent Skills for common patterns
- Document reusable intelligence artifacts
- Share skills in repository

**Multi-language Support - Urdu (+100 points)**
- UI text in English and Urdu
- Language toggle in settings
- Right-to-left (RTL) support
- Proper Urdu font rendering
- All user-facing text translatable

## Phase II Scope Boundaries

### In Scope
- Basic Level features (5 features)
- User authentication (signup/signin)
- Multi-user support with data isolation
- RESTful API with JWT security
- Responsive web UI
- Deployment to Vercel and cloud backend

## Governance

### Constitution Authority
This constitution supersedes all other practices and guidelines. All AI agents (Claude Code, custom subagents, skills) must comply. Non-compliance triggers immediate clarification with user.

### Amendment Process
- Constitution changes require explicit justification
- All agents acknowledge updated principles
- PHR created for constitution modifications
- ADR recommended for significant principle changes
- Technology stack frozen for Phase II (requires organizer approval to change)

### Quality Gates
- All code must trace to spec
- All specs approved before implementation
- All tests pass before deployment
- All security requirements validated
- All deployment checklist items completed

**Version**: 1.0.0 | **Ratified**: 2025-12-29 | **Last Amended**: 2025-12-29
