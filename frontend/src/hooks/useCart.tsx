"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { CartItem } from "@/types";

const STORAGE_KEY = "bobtronics-cart";

interface StoredCart {
  items: CartItem[];
  promoCode: string | null;
}

interface CartContextValue {
  items: CartItem[];
  promoCode: string | null;
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  applyPromo: (code: string) => void;
  removePromo: () => void;
  clearCart: () => void;
  totalQuantity: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Keep the cart in localStorage so it survives page reloads.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredCart = JSON.parse(saved);
        // Restoring from localStorage on mount is the one place we set state in an effect.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(parsed.items ?? []);
        setPromoCode(parsed.promoCode ?? null);
      }
    } catch {
      // Ignore storage errors and start with an empty cart.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, promoCode }));
    } catch {
      // Storage may be unavailable (private mode); the cart still works in memory.
    }
  }, [items, promoCode, loaded]);

  function addItem(item: CartItem) {
    setItems((current) => {
      const existing = current.find((i) => i.productId === item.productId);
      if (existing) {
        return current.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity, finish: item.finish ?? i.finish, configuration: item.configuration ?? i.configuration }
            : i
        );
      }
      return [...current, item];
    });
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) return;
    setItems((current) =>
      current.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  }

  function removeItem(productId: string) {
    setItems((current) => current.filter((i) => i.productId !== productId));
  }

  function applyPromo(code: string) {
    setPromoCode(code.toUpperCase());
  }

  function removePromo() {
    setPromoCode(null);
  }

  function clearCart() {
    setItems([]);
    setPromoCode(null);
  }

  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        promoCode,
        addItem,
        updateQuantity,
        removeItem,
        applyPromo,
        removePromo,
        clearCart,
        totalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
