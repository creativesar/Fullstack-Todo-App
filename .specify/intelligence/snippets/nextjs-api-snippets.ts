/**
 * Reusable Next.js TypeScript Code Snippets
 * Copy and adapt these patterns for new resources.
 */

// ============================================================================
// SNIPPET 1: TypeScript Interfaces for API
// ============================================================================

export interface Resource {
  id: number;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateResourceRequest {
  name: string;
  description?: string;
}

export interface UpdateResourceRequest {
  name: string;
  description?: string;
}

export interface DeleteResourceResponse {
  message: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthTokens {
  token: string;
  user: AuthUser;
}

// ============================================================================
// SNIPPET 2: Authentication Module
// ============================================================================

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem(AUTH_USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

export function setAuthData(token: string, user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuthData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

// ============================================================================
// SNIPPET 3: Generic API Client Class
// ============================================================================

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = getAuthToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

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

  // Resource CRUD methods
  async getResources(userId: string): Promise<Resource[]> {
    return this.request<Resource[]>(`/api/${userId}/resources`);
  }

  async createResource(
    userId: string,
    data: CreateResourceRequest
  ): Promise<Resource> {
    return this.request<Resource>(`/api/${userId}/resources`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getResource(userId: string, resourceId: number): Promise<Resource> {
    return this.request<Resource>(`/api/${userId}/resources/${resourceId}`);
  }

  async updateResource(
    userId: string,
    resourceId: number,
    data: UpdateResourceRequest
  ): Promise<Resource> {
    return this.request<Resource>(`/api/${userId}/resources/${resourceId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteResource(
    userId: string,
    resourceId: number
  ): Promise<DeleteResourceResponse> {
    return this.request<DeleteResourceResponse>(
      `/api/${userId}/resources/${resourceId}`,
      { method: "DELETE" }
    );
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const api = new ApiClient(API_URL);

// ============================================================================
// SNIPPET 4: React Hook for Data Fetching
// ============================================================================

import { useEffect, useState, useCallback } from "react";

interface UseResourcesReturn {
  resources: Resource[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createResource: (data: CreateResourceRequest) => Promise<void>;
  updateResource: (id: number, data: UpdateResourceRequest) => Promise<void>;
  deleteResource: (id: number) => Promise<void>;
}

export function useResources(): UseResourcesReturn {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = getAuthUser();

  const fetchResources = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const data = await api.getResources(user.id);
      setResources(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const createResource = async (data: CreateResourceRequest) => {
    if (!user) return;
    const newResource = await api.createResource(user.id, data);
    setResources((prev) => [newResource, ...prev]);
  };

  const updateResource = async (id: number, data: UpdateResourceRequest) => {
    if (!user) return;
    const updated = await api.updateResource(user.id, id, data);
    setResources((prev) =>
      prev.map((r) => (r.id === id ? updated : r))
    );
  };

  const deleteResource = async (id: number) => {
    if (!user) return;
    await api.deleteResource(user.id, id);
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  return {
    resources,
    loading,
    error,
    refetch: fetchResources,
    createResource,
    updateResource,
    deleteResource,
  };
}

// ============================================================================
// SNIPPET 5: Optimistic Update Pattern
// ============================================================================

const handleOptimisticToggle = async (resourceId: number) => {
  const user = getAuthUser();
  if (!user) return;

  // Save previous state for rollback
  const previousResources = [...resources];

  // Optimistic update
  setResources((prev) =>
    prev.map((r) =>
      r.id === resourceId ? { ...r, active: !r.active } : r
    )
  );

  try {
    await api.toggleResource(user.id, resourceId);
  } catch (e) {
    // Rollback on error
    setResources(previousResources);
    setError(e instanceof Error ? e.message : "Update failed");
  }
};

// ============================================================================
// SNIPPET 6: Loading State Component
// ============================================================================

interface LoadingStateProps {
  isLoading: boolean;
  error: string | null;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export function LoadingState({
  isLoading,
  error,
  children,
  loadingComponent,
}: LoadingStateProps) {
  if (isLoading) {
    return loadingComponent || <div className="animate-pulse">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 bg-red-500/10 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return <>{children}</>;
}

// ============================================================================
// SNIPPET 7: Protected Route Pattern
// ============================================================================

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const authenticated = isAuthenticated();

  useEffect(() => {
    if (!authenticated) {
      router.push("/signin");
    }
  }, [authenticated, router]);

  if (!authenticated) {
    return <div className="animate-pulse">Checking authentication...</div>;
  }

  return <>{children}</>;
}

// ============================================================================
// SNIPPET 8: Form Component with Validation
// ============================================================================

"use client";

import { useState, FormEvent } from "react";

interface ResourceFormProps {
  initialData?: { name: string; description?: string };
  onSubmit: (data: CreateResourceRequest) => Promise<void>;
  onCancel?: () => void;
}

export function ResourceForm({
  initialData,
  onSubmit,
  onCancel,
}: ResourceFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (name.length > 200) {
      setError("Name must be 200 characters or less");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      // Reset form on success
      setName("");
      setDescription("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-500/10 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={200}
          required
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
          placeholder="Enter name..."
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
          placeholder="Enter description..."
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 disabled:opacity-50"
        >
          {loading ? "Saving..." : initialData ? "Update" : "Create"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

// ============================================================================
// SNIPPET 9: Date Formatting Utility
// ============================================================================

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}
