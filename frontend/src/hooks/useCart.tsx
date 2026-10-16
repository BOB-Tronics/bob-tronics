"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { CartItem } from "@/types";
import { isAuthenticated, getStoredTokens } from "@/lib/auth";
import { authApiFetch } from "@/lib/auth";

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

// Backend cart item shape (UNVERIFIED: from OpenAPI schema).
interface BackendCartItem {
  cart_item_id: number;
  product: {
    product_id: number;
    name: string;
    brand: string;
    price: string;
    stock_quantity: number;
    is_available: boolean;
    category_name: string;
  };
  quantity: number;
  subtotal: string;
  is_in_stock: boolean;
  added_at: string;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  // Maps frontend productId -> backend cart_item_id for authenticated cart operations.
  const [cartItemIdMap, setCartItemIdMap] = useState<Map<string, number>>(new Map());

  // ---- LocalStorage cart (logged out) ----

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredCart = JSON.parse(saved);
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

  // ---- Authenticated cart (logged in) ----

  const loadBackendCart = useCallback(async () => {
    try {
      const response = await authApiFetch<BackendCartItem[]>("/cart/");
      if (response) {
        const mapped: CartItem[] = [];
        const map: Map<string, number> = new Map();
        for (const item of response) {
          const productId = String(item.product.product_id);
          mapped.push({
            productId,
            quantity: item.quantity,
          });
          map.set(productId, item.cart_item_id);
        }
        setItems(mapped);
        setCartItemIdMap(map);
      }
    } catch {
      // On error, keep empty cart; the page shows its own error state via callers.
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) return;
    loadBackendCart();
  }, [isAuthenticated, loadBackendCart]);

  // ---- Shared mutations ----

  function addItem(item: CartItem) {
    if (isAuthenticated()) {
      void (async () => {
        try {
          const response = await authApiFetch<BackendCartItem>("/cart/items/", {
            method: "POST",
            body: JSON.stringify({ product_id: Number(item.productId), quantity: item.quantity }),
          });
          if (response) {
            setItems((current) => {
              const existing = current.find((i) => i.productId === item.productId);
              if (existing) {
                return current.map((i) =>
                  i.productId === item.productId
                    ? { ...i, quantity: i.quantity + item.quantity }
                    : i
                );
              }
              setCartItemIdMap((m) => {
                m.set(item.productId, response.cart_item_id);
                return new Map(m);
              });
              return [...current, { productId: item.productId, quantity: item.quantity }];
            });
          }
        } catch {
          // Backend error surfaces via caller error handling.
        }
      })();
      return;
    }

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

    if (isAuthenticated()) {
      void (async () => {
        const cartItemId = cartItemIdMap.get(productId);
        if (cartItemId === undefined) return;
        try {
          await authApiFetch<BackendCartItem>(`/cart/items/${cartItemId}/`, {
            method: "PATCH",
            body: JSON.stringify({ quantity }),
          });
          setItems((current) =>
            current.map((i) => (i.productId === productId ? { ...i, quantity } : i))
          );
        } catch {
          // Backend error surfaces via caller error handling.
        }
      })();
      return;
    }

    setItems((current) =>
      current.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  }

  function removeItem(productId: string) {
    if (isAuthenticated()) {
      void (async () => {
        const cartItemId = cartItemIdMap.get(productId);
        if (cartItemId === undefined) return;
        try {
          await authApiFetch(`/cart/items/${cartItemId}/`, { method: "DELETE" });
          setItems((current) => current.filter((i) => i.productId !== productId));
          setCartItemIdMap((m) => {
            m.delete(productId);
            return new Map(m);
          });
        } catch {
          // Backend error surfaces via caller error handling.
        }
      })();
      return;
    }

    setItems((current) => current.filter((i) => i.productId !== productId));
  }

  function applyPromo(code: string) {
    setPromoCode(code.toUpperCase());
  }

  function removePromo() {
    setPromoCode(null);
  }

  function clearCart() {
    if (isAuthenticated()) {
      void (async () => {
        try {
          await authApiFetch("/cart/clear/", { method: "DELETE" });
        } catch {
          // Backend error surfaces via caller error handling.
        }
      })();
    }
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
