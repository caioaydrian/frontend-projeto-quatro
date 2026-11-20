import type { CartItem } from "../contexts/useCart";

export type OrderMode = "dine-in" | "take-out";

export interface CompletedOrder {
  number: string;
  mode: OrderMode;
  items: CartItem[];
  total: number;
  createdAt: string;
}
