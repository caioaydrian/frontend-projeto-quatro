import { apiFetch } from "../utils/api";
import type { User } from "../types/user";

export interface CreateUserInput {
  name: string;
  email: string;
  cpf: string;
  password: string;
  role?: string;
}

export interface UpdateUserInput {
  name: string;
  cpf: string;
  password: string;
  role?: string;
}

interface UserMessageResponse {
  message: string;
  user: User;
}

export async function listUsers(): Promise<User[]> {
  return apiFetch<User[]>("/users");
}

export async function getUserById(id: number): Promise<User> {
  return apiFetch<User>(`/users/${id}`);
}

export async function createUser(data: CreateUserInput): Promise<UserMessageResponse> {
  return apiFetch<UserMessageResponse>("/users", {
    method: "POST",
    body: data,
  });
}

export async function updateUser(
  id: number,
  data: UpdateUserInput
): Promise<UserMessageResponse> {
  return apiFetch<UserMessageResponse>(`/users/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteUser(id: number): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/users/${id}`, {
    method: "DELETE",
  });
}
