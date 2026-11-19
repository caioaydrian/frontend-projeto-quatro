import { createContext, useContext } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  categoryName?: string;
  imageUrl?: string | null;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (drink: {
    id: number;
    name: string;
    price: number;
    categoryName?: string;
    imageUrl?: string | null;
  }) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isBagOpen: boolean;
  setIsBagOpen: (open: boolean) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
