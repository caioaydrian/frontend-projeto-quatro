import { getToken, clearToken } from "./auth";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export async function apiFetch<T>(endpoint: string, options: ApiFetchOptions = {}): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const token = getToken();
  const headers = new Headers(options.headers || {});

  let body: BodyInit | null | undefined;
  if (options.body !== undefined) {
    if (
      typeof options.body === "string" ||
      options.body instanceof FormData ||
      options.body instanceof Blob
    ) {
      body = options.body;
    } else {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      body = JSON.stringify(options.body);
    }
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body,
  });

  if (response.status === 401) {
    clearToken();
    if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
      window.location.href = "/login";
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage =
      errorData?.error || errorData?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}
