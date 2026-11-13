import { apiFetch, type PaginatedResponse } from "../utils/api";
import type { Category } from "../types/category";

export interface CategoryInput {
  name: string;
}

interface CategoryMessageResponse {
  message: string;
  category: Category;
}

export async function listCategories(page = 1, limit = 10): Promise<PaginatedResponse<Category>> {
  return apiFetch<PaginatedResponse<Category>>(`/categories?page=${page}&limit=${limit}`);
}

export async function createCategory(data: CategoryInput): Promise<CategoryMessageResponse> {
  return apiFetch<CategoryMessageResponse>("/categories", {
    method: "POST",
    body: data,
  });
}

export async function updateCategory(
  id: number,
  data: CategoryInput
): Promise<CategoryMessageResponse> {
  return apiFetch<CategoryMessageResponse>(`/categories/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteCategory(id: number): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/categories/${id}`, {
    method: "DELETE",
  });
}
