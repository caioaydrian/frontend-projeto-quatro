import type { Category } from "./category";

export interface Drink {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  category?: Category;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface DrinkInput {
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  imageUrl?: string | null;
}
