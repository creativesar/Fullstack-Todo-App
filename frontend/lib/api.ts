"use client";

import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  DeleteTaskResponse,
} from "./types";
import { getAuthToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://creativesar-phase-11-todo.hf.space";

/**
 * API Client for making authenticated requests to the backend API.
 * Automatically includes JWT token in Authorization header.
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make an authenticated request to the API
   */
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

    // Merge with any provided headers
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

  /**
   * Get all tasks for a user
   * GET /api/{user_id}/tasks
   */
  async getTasks(userId: string): Promise<Task[]> {
    return this.request<Task[]>(`/api/${userId}/tasks`);
  }

  /**
   * Create a new task
   * POST /api/{user_id}/tasks
   */
  async createTask(userId: string, data: CreateTaskRequest): Promise<Task> {
    return this.request<Task>(`/api/${userId}/tasks`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Get a single task by ID
   * GET /api/{user_id}/tasks/{task_id}
   */
  async getTask(userId: string, taskId: number): Promise<Task> {
    return this.request<Task>(`/api/${userId}/tasks/${taskId}`);
  }

  /**
   * Update an existing task
   * PUT /api/{user_id}/tasks/{task_id}
   */
  async updateTask(
    userId: string,
    taskId: number,
    data: UpdateTaskRequest
  ): Promise<Task> {
    return this.request<Task>(`/api/${userId}/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a task
   * DELETE /api/{user_id}/tasks/{task_id}
   */
  async deleteTask(userId: string, taskId: number): Promise<DeleteTaskResponse> {
    return this.request<DeleteTaskResponse>(`/api/${userId}/tasks/${taskId}`, {
      method: "DELETE",
    });
  }

  /**
   * Toggle task completion status
   * PATCH /api/{user_id}/tasks/{task_id}/complete
   */
  async toggleCompletion(userId: string, taskId: number): Promise<Task> {
    return this.request<Task>(`/api/${userId}/tasks/${taskId}/complete`, {
      method: "PATCH",
    });
  }
}

// Export singleton instance
export const api = new ApiClient(API_URL);
