# Reusable Intelligence

This directory contains reusable patterns, snippets, learnings, and skills extracted from the Phase II Todo Full-Stack Application.

## Directory Structure

```
intelligence/
├── README.md                 # This file
├── patterns/                 # Architectural patterns and best practices
│   ├── fastapi-crud-pattern.md      # Backend CRUD pattern
│   ├── nextjs-api-client-pattern.md # Frontend API client pattern
│   └── react-interactive-card-pattern.md # UI component pattern
├── snippets/                 # Copy-paste code templates
│   ├── fastapi-crud-snippets.py     # Python backend code snippets
│   └── nextjs-api-snippets.ts       # TypeScript frontend code snippets
├── learnings/                # Architecture decisions and insights
│   └── phase-ii-learnings.md        # Phase II lessons learned
└── skills/                   # Claude Code Skills (future)
    └── (placeholder for skills)
```

## How to Use

### Patterns

Patterns are detailed guides for implementing specific architectural solutions. They include:
- Context and rationale
- Full implementation examples
- Best practices and pitfalls
- Dependencies and prerequisites

**Usage:** Read the pattern document, understand the principles, then adapt the code to your specific needs.

### Snippets

Snippets are ready-to-copy code templates. They are:
- Self-contained and well-commented
- Labeled with clear section markers
- Designed to be adapted with find-and-replace

**Usage:** Copy the relevant snippet, replace placeholder names (e.g., `Resource` → `Project`), and integrate into your codebase.

### Learnings

Learnings capture decisions, insights, and lessons from project implementation. They include:
- What decisions were made and why
- What worked well
- What could be improved
- Production considerations

**Usage:** Review before starting a similar project to avoid repeating mistakes and leverage proven approaches.

### Skills (Future)

Skills will contain Claude Code Skills for automating repetitive tasks:
- CRUD endpoint generation
- Schema creation from models
- Test scaffolding
- Deployment setup

## Reusable Patterns Summary

### Backend (FastAPI + SQLModel)

| Pattern | Description | Use When |
|---------|-------------|----------|
| CRUD Service Layer | Separation of routes/services/models | Any REST API |
| JWT Auth Middleware | Token verification with HTTPBearer | JWT-based auth |
| User Isolation | Filter all queries by user_id | Multi-tenant apps |
| Async DB Sessions | SQLModel + asyncpg connection pooling | PostgreSQL APIs |

### Frontend (Next.js + TypeScript)

| Pattern | Description | Use When |
|---------|-------------|----------|
| API Client Singleton | Centralized fetch with auth injection | Any API calls |
| Auth State Management | localStorage + SSR-safe getters | JWT auth |
| Optimistic Updates | Update UI immediately, sync in background | Better UX |
| Protected Routes | Redirect unauthenticated users | Auth-required pages |

### UI Components (React + Tailwind)

| Pattern | Description | Use When |
|---------|-------------|----------|
| Interactive Card | Animated list items with actions | Task/item lists |
| Status Badges | Colored status indicators | Status display |
| Form with Validation | Input handling + error states | Any forms |
| Loading States | Skeleton + error handling | Async data |

## Quick Start Examples

### Adding a New Resource (Backend)

1. Copy model from `snippets/fastapi-crud-snippets.py` (SNIPPET 1)
2. Replace `Resource` with your entity name
3. Copy schemas (SNIPPET 2), service functions (SNIPPET 3), routes (SNIPPET 4)
4. Register router in `main.py`

### Adding a New Resource (Frontend)

1. Copy interfaces from `snippets/nextjs-api-snippets.ts` (SNIPPET 1)
2. Replace `Resource` with your entity name
3. Add methods to API client (SNIPPET 3)
4. Create hook (SNIPPET 4) and components

## Contributing

When you discover new patterns or improve existing ones:

1. Document the pattern/snippet clearly
2. Include rationale and context
3. Test the code before adding
4. Update this README if needed

---

**Version:** 1.0.0
**Created:** 2025-12-29
**Project:** Phase II Todo Full-Stack Application
