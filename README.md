# Todo Full-Stack Web Application - Phase II

**Hackathon: Evolution of Todo**
**Phase:** Phase II - Full-Stack Web Application
**Due Date:** December 14, 2025
**Points:** 150 + Bonus Points

## Project Overview

A modern, multi-user todo application with persistent storage, JWT-based authentication, and responsive design. Built using spec-driven development with Claude Code.

## Technology Stack

### Frontend
- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Authentication:** Better Auth
- **Deployment:** Vercel

### Backend
- **Framework:** FastAPI (Python)
- **ORM:** SQLModel
- **Authentication:** JWT verification
- **Database:** Neon Serverless PostgreSQL
- **Deployment:** Railway

### Development Tools
- **Python Package Manager:** UV
- **Spec-Driven Development:** Claude Code + Spec-Kit Plus

## Project Structure

```
hackathon-todo/
├── .specify/              # Spec-Kit Plus configuration
│   ├── memory/            # Constitution and context
│   └── templates/         # PHR templates
├── specs/                 # Specification files
│   └── phase-ii-fullstack/
│       ├── spec.md        # Requirements specification
│       ├── plan.md        # Implementation plan
│       └── tasks.md       # Task breakdown
├── history/               # Development history
│   ├── prompts/           # Prompt History Records
│   └── adr/               # Architecture Decision Records
├── frontend/              # Next.js application
├── backend/               # FastAPI application
├── CLAUDE.md              # Claude Code instructions
└── README.md              # This file
```

## Features (Phase II)

### Basic Level Features (5)
1. **Add Task** - Create new tasks with title and description
2. **View Task List** - Display all user's tasks
3. **Update Task** - Edit task title and description
4. **Delete Task** - Remove tasks from list
5. **Mark Complete** - Toggle task completion status

### Authentication
- User signup and signin with Better Auth
- JWT token-based authentication
- Multi-user support with data isolation

## Getting Started

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.13+ (for backend)
- UV (Python package manager)
- Neon PostgreSQL account
- Vercel account (for deployment)
- Railway account (for backend deployment)

### Local Development

#### Backend Setup
```bash
cd backend
uv sync
uvicorn main:app --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

#### Backend (.env)
```
DATABASE_URL=postgresql://user:password@neon-host/dbname
BETTER_AUTH_SECRET=<your-secret-32-chars>
CORS_ORIGINS=http://localhost:3000
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_SECRET=<same-as-backend>
```

## Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Configure root directory: `/frontend`
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push to main

### Backend (Railway)
1. Connect GitHub repository to Railway
2. Configure root directory: `/backend`
3. Set environment variables in Railway dashboard
4. Deploy automatically on push to main

### Database (Neon)
1. Create Neon account and project
2. Create database and run schema migrations
3. Copy connection string to backend environment

## Development Process

This project follows **Spec-Driven Development (SDD)**:
1. **Constitution** - Project principles and constraints
2. **Specification** - Requirements and user stories
3. **Plan** - Architecture and implementation approach
4. **Tasks** - Actionable task breakdown
5. **Implementation** - Code generation via Claude Code

All code is generated through Claude Code with iterative spec refinement. No manual coding allowed per hackathon rules.

## Spec-Driven Artifacts

- **Constitution:** `.specify/memory/constitution.md` - Project principles
- **Specification:** `specs/phase-ii-fullstack/spec.md` - Requirements
- **Plan:** `specs/phase-ii-fullstack/plan.md` - Architecture
- **Tasks:** `specs/phase-ii-fullstack/tasks.md` - Implementation tasks

## Bonus Features (Optional)

### Reusable Intelligence (+200 points)
- Custom Claude Code Subagents
- Agent Skills for common patterns
- Documented in `/skills` directory

### Multi-language Support - Urdu (+100 points)
- English ↔ Urdu toggle
- RTL layout support
- Proper Urdu font rendering

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## API Documentation

### Authentication
- POST `/auth/signup` - Create new user account
- POST `/auth/signin` - Login with email/password

### Tasks API (All require JWT token)
- GET `/api/{user_id}/tasks` - List all tasks
- POST `/api/{user_id}/tasks` - Create new task
- GET `/api/{user_id}/tasks/{id}` - Get task by ID
- PUT `/api/{user_id}/tasks/{id}` - Update task
- DELETE `/api/{user_id}/tasks/{id}` - Delete task
- PATCH `/api/{user_id}/tasks/{id}/complete` - Toggle completion

## Contributing

This is a hackathon project developed for the "Evolution of Todo" competition. Development follows strict spec-driven methodology using Claude Code.

## License

This project is created for educational purposes as part of the Panaversity/PIAIC/GIAIC hackathon.

## Contact

- **Demo Video:** [Link to be added]
- **Live Frontend:** [Vercel URL to be added]
- **Live Backend:** [Railway URL to be added]

---

**Status:** Phase II - In Development
**Last Updated:** 2025-12-29
**Hackathon Submission:** December 14, 2025
