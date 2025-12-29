# Frontend Guidelines - Todo Web App

## Stack
- Next.js 16+ (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Better Auth

## Patterns
- Use Server Components by default
- Client Components only when needed (interactivity, browser APIs)
- API calls go through `/lib/api.ts`
- Centralized error handling
- Responsive design (mobile-first)

## Component Structure
```
frontend/
├── app/
│   ├── layout.tsx              # Root layout with auth provider
│   ├── page.tsx                # Landing page
│   ├── (auth)/
│   │   ├── signin/page.tsx     # Sign-in page (Client)
│   │   └── signup/page.tsx     # Sign-up page (Client)
│   └── (protected)/
│       └── tasks/
│           ├── page.tsx        # Task list page (Server wrapper)
│           └── TaskList.tsx    # Task list UI (Client)
├── components/
│   ├── TaskCard.tsx            # Individual task display (Client)
│   ├── TaskForm.tsx            # Add/edit task form (Client)
│   ├── AuthButton.tsx          # Sign-out button (Client)
│   └── ErrorBoundary.tsx       # Error handling wrapper (Client)
├── lib/
│   ├── api.ts                  # API client with JWT injection
│   ├── auth.ts                 # Better Auth configuration
│   └── types.ts                # TypeScript interfaces
└── styles/
    └── globals.css             # Tailwind CSS imports
```

## API Client
All backend calls should use the API client:

```typescript
import { api } from '@/lib/api';
const tasks = await api.getTasks(userId);
```

## Styling
- Use Tailwind CSS classes
- No inline styles
- Responsive breakpoints: sm (640px), md (768px), lg (1024px)
- Follow existing component patterns

## Authentication
- Better Auth manages JWT tokens
- Token stored in localStorage (key: "auth_token")
- Include token in Authorization header for all API calls
- Redirect to /signin if not authenticated

## Error Handling
- Display user-friendly error messages
- Use Error Boundaries for React errors
- Log errors to console
- Don't expose sensitive information

## Running Locally
```bash
npm run dev
```

## Build for Production
```bash
npm run build
npm start
```

## Code Quality
- TypeScript strict mode enabled
- No `any` types without justification
- Proper type definitions for props
- Accessibility attributes (aria-*)
- Keyboard navigation support
