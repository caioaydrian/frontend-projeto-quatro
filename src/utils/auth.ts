import type { User } from "../types/user";

const TOKEN_KEY = "token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("user");
}

export function getUserFromToken(token: string | null): User | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const data = JSON.parse(decodeURIComponent(escape(decoded)));
    if (!data.id) return null;
    return {
      id: data.id,
      name: data.name || "",
      email: data.email || "",
      role: data.role || "client",
      cpf: "",
    };
  } catch {
    return null;
  }
}
