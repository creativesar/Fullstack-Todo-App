// TypeScript interfaces for the Todo application

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string;
}

export interface DeleteTaskResponse {
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

export interface SignUpRequest {
  email: string;
  password: string;
  name?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}
