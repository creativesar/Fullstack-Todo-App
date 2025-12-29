# Phase II Architecture Learnings

**Project:** Todo Full-Stack Application
**Phase:** Phase II - Full-Stack Web Application
**Date:** 2025-12-29

## Summary

This document captures key architectural decisions, lessons learned, and reusable insights from building a full-stack todo application with FastAPI, Next.js, and PostgreSQL.

---

## 1. Architecture Decisions

### 1.1 Monorepo Structure

**Decision:** Single repository with `/frontend` and `/backend` folders

**Rationale:**
- Claude Code operates more effectively in a single context
- Spec-driven development benefits from unified artifact location
- Cross-cutting changes (API contracts) are simpler to coordinate
- Reduced coordination overhead for hackathon timeline

**Lesson Learned:** For AI-assisted development, monorepo significantly improves context awareness and code generation quality.

### 1.2 JWT-Based Stateless Authentication

**Decision:** Use JWT tokens stored in localStorage

**Rationale:**
- Aligns with stateless architecture principle
- Simplifies backend (no session store needed)
- Any backend instance can verify tokens
- Better Auth provides JWT support out-of-the-box

**Tradeoffs Accepted:**
- Token theft risk (mitigated by HTTPS + short expiry)
- No immediate revocation (acceptable for Phase II)

**Lesson Learned:** For MVP/hackathon projects, localStorage + JWT is pragmatic. For production, consider httpOnly cookies.

### 1.3 SQLModel for ORM

**Decision:** Use SQLModel instead of raw SQLAlchemy or Prisma

**Rationale:**
- Single model definition serves as both ORM and Pydantic validation
- Seamless FastAPI integration (same creator)
- Less boilerplate than SQLAlchemy
- Type-safe queries

**Lesson Learned:** SQLModel's dual-purpose models (DB + API) reduce code duplication significantly.

### 1.4 Neon Serverless PostgreSQL

**Decision:** Use Neon instead of self-hosted or Supabase

**Rationale:**
- True serverless with connection pooling
- Generous free tier
- Database branching for testing
- Simple setup

**Gotcha:** Neon connections can sleep, requiring `pool_pre_ping=True` to handle reconnection.

---

## 2. Technical Insights

### 2.1 Async Database Connection (Neon + asyncpg)

**Challenge:** Neon requires SSL, but asyncpg handles SSL differently than psycopg2.

**Solution:**
```python
import ssl
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

engine = create_async_engine(
    DATABASE_URL,
    pool_pre_ping=True,        # Handle Neon sleep
    pool_recycle=300,          # Recycle connections every 5 minutes
    connect_args={"ssl": ssl_context}
)
```

**Lesson Learned:** Remove `?sslmode=require` from URL and pass SSL context directly to asyncpg.

### 2.2 User Isolation Pattern

**Pattern:** All database queries filter by `user_id` extracted from JWT.

```python
# In service layer - ALWAYS include user_id filter
statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)

# In route - ALWAYS verify user_id matches token
if auth["user_id"] != user_id:
    raise HTTPException(status_code=403, detail="Forbidden")
```

**Lesson Learned:** Double verification (URL + token) prevents security holes from URL manipulation.

### 2.3 Error Response Consistency

**Pattern:** All errors return same JSON structure.

```json
{"detail": "Human-readable error message"}
```

**Implementation:**
```python
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}  # Don't leak internals
    )
```

**Lesson Learned:** Consistent error format simplifies frontend error handling.

### 2.4 Next.js App Router Patterns

**Server vs Client Components:**
- Server Components: Data fetching, SEO, initial render
- Client Components: Interactivity, form handling, browser APIs

**Pattern Used:**
```
app/(protected)/tasks/
├── page.tsx          # Server Component - auth check, initial data
└── TaskList.tsx      # Client Component - interactivity, state
```

**Lesson Learned:** Keep the boundary clean - Server Component for data, Client Component for UI.

### 2.5 API Client Singleton Pattern

**Pattern:** Single API client instance with auth injection.

```typescript
// lib/api.ts
class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getAuthToken();
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    // ...
  }
}

export const api = new ApiClient(API_URL);  // Singleton
```

**Lesson Learned:** Centralized auth handling prevents scattered token logic across components.

---

## 3. Security Learnings

### 3.1 JWT Secret Synchronization

**Requirement:** `BETTER_AUTH_SECRET` must be identical on frontend and backend.

**Implementation:**
- Frontend generates tokens with the secret
- Backend verifies tokens with the same secret
- Mismatch = all tokens rejected

**Lesson Learned:** Document this clearly in setup instructions. Use environment variable management.

### 3.2 CORS Configuration

**Production CORS:**
```python
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Specific origins, not "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Lesson Learned:** Never use `"*"` for origins in production when using credentials.

### 3.3 Input Validation Layers

**Multiple validation layers used:**
1. Pydantic models for request body validation
2. SQLModel field constraints for DB-level validation
3. Route handlers for authorization checks

**Lesson Learned:** Defense in depth - validate at every layer.

---

## 4. Performance Insights

### 4.1 Database Connection Pooling

**Configuration:**
```python
engine = create_async_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=300,
)
```

**Lesson Learned:** Connection pooling is essential for serverless databases like Neon.

### 4.2 Frontend Optimistic Updates

**Pattern:**
```typescript
const handleToggle = async (taskId: number) => {
  // Update UI immediately
  setTasks((prev) =>
    prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
  );

  try {
    await api.toggleCompletion(user.id, taskId);
  } catch (e) {
    // Revert on error
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  }
};
```

**Lesson Learned:** Optimistic updates make the UI feel instant.

---

## 5. Development Workflow Insights

### 5.1 Spec-Driven Development Value

**Process:**
1. Constitution → Principles and constraints
2. Spec → User stories and requirements
3. Plan → Architecture decisions
4. Tasks → Atomic implementation steps

**Lesson Learned:** Upfront specification dramatically reduces code revision cycles.

### 5.2 Environment Variables Management

**Required Variables:**
```env
# Backend
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret-here
CORS_ORIGINS=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Lesson Learned:** Document all required env vars in README and `.env.example`.

---

## 6. Reusable Artifacts Created

### Patterns
1. **FastAPI CRUD Pattern** - Complete backend structure for any resource
2. **Next.js API Client Pattern** - Type-safe frontend API integration
3. **React Interactive Card Pattern** - Animated, accessible list items

### Skills Potential
- FastAPI CRUD endpoint generator
- Pydantic schema generator from SQLModel
- Next.js protected route scaffolding

---

## 7. What Would Be Different in Production

1. **Authentication:** httpOnly cookies instead of localStorage
2. **Token Expiry:** Implement refresh token flow
3. **Error Tracking:** Add Sentry or similar
4. **Rate Limiting:** Implement API rate limits
5. **Caching:** Add Redis for frequently accessed data
6. **Testing:** Increase coverage to 80%+
7. **CI/CD:** Automated testing and deployment

---

## 8. Key Takeaways

1. **Monorepo + AI = Better Context** - Single repo improves AI code generation
2. **SQLModel is Excellent** - Dual-purpose models reduce boilerplate
3. **Spec First Saves Time** - Clear specs reduce revision cycles
4. **Type Safety Everywhere** - TypeScript + Python type hints catch errors early
5. **Consistent Patterns** - Same structure across routes/services/models
6. **Security by Default** - User isolation at every layer

---

**Version:** 1.0.0
**Authors:** Claude Code (AI-assisted development)
**Last Updated:** 2025-12-29
