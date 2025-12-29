"use client";

import { AuthTokens, SignInRequest, SignUpRequest } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://creativesar-phase-11-todo.hf.space";

/**
 * Authentication module for managing user authentication with JWT tokens.
 * Uses Better Auth secret for token generation and validation.
 */

// Token storage key
const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

/**
 * Get the stored authentication token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Get the stored user information from localStorage
 */
export function getAuthUser(): { id: string; email: string; name?: string } | null {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem(AUTH_USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Store authentication token and user info in localStorage
 */
export function setAuthData(token: string, user: { id: string; email: string; name?: string }): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

/**
 * Clear authentication data from localStorage
 */
export function clearAuthData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

/**
 * Sign up a new user
 */
export async function signUp(data: SignUpRequest): Promise<AuthTokens> {
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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

/**
 * Sign in an existing user
 */
export async function signIn(data: SignInRequest): Promise<AuthTokens> {
  const response = await fetch(`${API_URL}/api/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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

/**
 * Sign out the current user
 */
export function signOut(): void {
  clearAuthData();
}
