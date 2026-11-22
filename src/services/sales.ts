import { apiFetch } from "../utils/api";
import type { Sale } from "../types/sale";

interface SaleMessageResponse {
  message: string;
  sale: Sale;
}

export interface PaginatedSales {
  data: Sale[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function createSale(items: { drinkId: number; quantity: number }[]): Promise<Sale> {
  const res = await apiFetch<SaleMessageResponse>("/sales", {
    method: "POST",
    body: { items },
  });
  return res.sale;
}

export async function listSales(page = 1, limit = 10): Promise<PaginatedSales> {
  return apiFetch<PaginatedSales>(`/sales?page=${page}&limit=${limit}`);
}

export async function updateSaleStatus(id: number, status: string): Promise<{ message: string; sale: Sale }> {
  return apiFetch<{ message: string; sale: Sale }>(`/sales/${id}`, {
    method: "PUT",
    body: { status },
  });
}

export async function deleteSale(id: number): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/sales/${id}`, {
    method: "DELETE",
  });
}

