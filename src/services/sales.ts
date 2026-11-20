import { apiFetch } from "../utils/api";
import type { Sale } from "../types/sale";

interface SaleMessageResponse {
  message: string;
  sale: Sale;
}

export async function createSale(items: { drinkId: number; quantity: number }[]): Promise<Sale> {
  const res = await apiFetch<SaleMessageResponse>("/sales", {
    method: "POST",
    body: { items },
  });
  return res.sale;
}
