import { useState, useEffect, type ReactNode } from "react";
import { CartContext, type CartItem } from "./useCart";

const CART_STORAGE_KEY = "dark_coffee_bag";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isBagOpen, setIsBagOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      void err;
    }
  }, [items]);

  const addItem = (drink: {
    id: number;
    name: string;
    price: number;
    categoryName?: string;
    imageUrl?: string | null;
  }) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === drink.id);
      if (existing) {
        return prev.map((item) =>
          item.id === drink.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: drink.id,
          name: drink.name,
          price: Number(drink.price),
          quantity: 1,
          categoryName: drink.categoryName,
          imageUrl: drink.imageUrl,
        },
      ];
    });
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isBagOpen,
        setIsBagOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
