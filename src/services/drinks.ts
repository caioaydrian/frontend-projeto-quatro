import { apiFetch, type PaginatedResponse } from "../utils/api";
import type { Drink, DrinkInput } from "../types/drink";

interface DrinkMessageResponse {
  message: string;
  drink: Drink;
}

export async function listDrinks(page = 1, limit = 10): Promise<PaginatedResponse<Drink>> {
  return apiFetch<PaginatedResponse<Drink>>(`/drinks?page=${page}&limit=${limit}`);
}

export async function getDrink(id: number): Promise<Drink> {
  return apiFetch<Drink>(`/drinks/${id}`);
}

export async function createDrink(data: DrinkInput): Promise<DrinkMessageResponse> {
  return apiFetch<DrinkMessageResponse>("/drinks", {
    method: "POST",
    body: data,
  });
}

export async function updateDrink(id: number, data: DrinkInput): Promise<DrinkMessageResponse> {
  return apiFetch<DrinkMessageResponse>(`/drinks/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteDrink(id: number): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/drinks/${id}`, {
    method: "DELETE",
  });
}
