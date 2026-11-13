import type { Category } from "./category";

export interface Drink {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface DrinkInput {
  name: string;
  price: number;
  stock: number;
  categoryId: number;
}
