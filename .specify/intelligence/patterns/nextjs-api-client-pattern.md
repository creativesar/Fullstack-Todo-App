# Next.js TypeScript API Client Pattern

**Category:** Frontend API Pattern
**Stack:** Next.js App Router + TypeScript + fetch API
**Reusability:** High - Applicable to any REST API integration

## Overview

A type-safe, reusable pattern for implementing API clients in Next.js applications with JWT authentication, centralized error handling, and clean separation of concerns.

## Architecture

```
lib/
├── api.ts       # API client singleton with authenticated requests
├── auth.ts      # Authentication state management
└── types.ts     # TypeScript interfaces for API contracts
```

## Pattern Implementation

### 1. TypeScript Interfaces (types.ts)

```typescript
// Resource interfaces match backend response models
export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

// Request interfaces for mutations
export interface CreateTaskRequest {
  title: string;
  description?: string;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string;
}

// Response interfaces for specific operations
export interface DeleteTaskResponse {
  message: string;
}

// Auth-related interfaces
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthTokens {
  token: string;
  user: AuthUser;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}
```

### 2. Authentication Module (auth.ts)

```typescript
"use client";

import { AuthTokens, SignInRequest, SignUpRequest } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

// Token retrieval with SSR safety
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

// User info retrieval with SSR safety
export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem(AUTH_USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

// Store auth data atomically
export function setAuthData(token: string, user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

// Clear auth data on logout
export function clearAuthData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

// Auth state check
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

// Sign up with automatic token storage
export async function signUp(data: SignUpRequest): Promise<AuthTokens> {
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Sign up failed");
  }

  const result = await response.json();
  setAuthData(result.token, result.user);
  return result;
}

// Sign in with automatic token storage
export async function signIn(data: SignInRequest): Promise<AuthTokens> {
  const response = await fetch(`${API_URL}/api/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Sign in failed");
  }

  const result = await response.json();
  setAuthData(result.token, result.user);
  return result;
}

// Sign out and clear local data
export function signOut(): void {
  clearAuthData();
}
```

### 3. API Client Class (api.ts)

```typescript
"use client";

import { Task, CreateTaskRequest, UpdateTaskRequest, DeleteTaskResponse } from "./types";
import { getAuthToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Generic request method with authentication
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getAuthToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Merge with provided headers
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: `Request failed with status ${response.status}`,
      }));
      throw new Error(error.detail || "API request failed");
    }

    return response.json();
  }

  // CRUD Operations for Tasks

  async getTasks(userId: string): Promise<Task[]> {
    return this.request<Task[]>(`/api/${userId}/tasks`);
  }

  async createTask(userId: string, data: CreateTaskRequest): Promise<Task> {
    return this.request<Task>(`/api/${userId}/tasks`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getTask(userId: string, taskId: number): Promise<Task> {
    return this.request<Task>(`/api/${userId}/tasks/${taskId}`);
  }

  async updateTask(userId: string, taskId: number, data: UpdateTaskRequest): Promise<Task> {
    return this.request<Task>(`/api/${userId}/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteTask(userId: string, taskId: number): Promise<DeleteTaskResponse> {
    return this.request<DeleteTaskResponse>(`/api/${userId}/tasks/${taskId}`, {
      method: "DELETE",
    });
  }

  async toggleCompletion(userId: string, taskId: number): Promise<Task> {
    return this.request<Task>(`/api/${userId}/tasks/${taskId}/complete`, {
      method: "PATCH",
    });
  }
}

// Export singleton instance
export const api = new ApiClient(API_URL);
```

## Usage in Components

### Fetching Data

```typescript
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getAuthUser } from "@/lib/auth";
import { Task } from "@/lib/types";

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = getAuthUser();
    if (!user) return;

    api.getTasks(user.id)
      .then(setTasks)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{/* Render tasks */}</div>;
}
```

### Mutations with Optimistic Updates

```typescript
const handleToggle = async (taskId: number) => {
  const user = getAuthUser();
  if (!user) return;

  // Optimistic update
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

### Creating New Resources

```typescript
const handleCreate = async (title: string, description?: string) => {
  const user = getAuthUser();
  if (!user) return;

  try {
    const newTask = await api.createTask(user.id, { title, description });
    setTasks((prev) => [newTask, ...prev]); // Add to beginning (newest first)
  } catch (e) {
    setError(e.message);
  }
};
```

## Key Principles

1. **Type Safety**: Full TypeScript coverage with strict interfaces
2. **SSR Safety**: Check `typeof window` before accessing localStorage
3. **Singleton Pattern**: Export single API client instance
4. **Centralized Auth**: Token injection handled in one place
5. **Consistent Errors**: All errors throw with meaningful messages

## Error Handling Pattern

```typescript
try {
  const result = await api.someOperation();
  // Handle success
} catch (error) {
  if (error instanceof Error) {
    // Display error.message to user
    showToast({ type: "error", message: error.message });
  }
}
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Extending for New Resources

To add a new resource (e.g., "projects"):

```typescript
// Add to types.ts
export interface Project {
  id: number;
  name: string;
  // ...
}

export interface CreateProjectRequest {
  name: string;
}

// Add methods to ApiClient class in api.ts
async getProjects(userId: string): Promise<Project[]> {
  return this.request<Project[]>(`/api/${userId}/projects`);
}

async createProject(userId: string, data: CreateProjectRequest): Promise<Project> {
  return this.request<Project>(`/api/${userId}/projects`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
// ... etc
```

---

**Version:** 1.0.0
**Extracted From:** Phase II Todo Full-Stack Application
**Last Updated:** 2025-12-29
