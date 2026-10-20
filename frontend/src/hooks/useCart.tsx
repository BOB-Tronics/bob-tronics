"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { BackendCartItem, CartItem } from "@/types";
import { ApiError } from "@/lib/api";
import { isAuthenticated, authApiFetch } from "@/lib/auth";

const STORAGE_KEY = "bobtronics-cart";

interface StoredCart {
  items: CartItem[];
  promoCode: string | null;
}

interface CartContextValue {
  items: CartItem[];
  promoCode: string | null;
  addItem: (item: CartItem) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  applyPromo: (code: string) => void;
  removePromo: () => void;
  clearCart: () => Promise<void>;
  // Re-reads the backend cart (used after "move to cart" from the wishlist).
  reload: () => Promise<void>;
  totalQuantity: number;
  clearError: string;
  cartError: string;
  cartErrorProductId: string | null;
  backendLoading: boolean;
  backendError: string;
}

const CartContext = createContext<CartContextValue | null>(null);

function cartFailureMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 400) return error.message;
  return "Something went wrong. Please try again.";
}

// GET /cart/ may return a plain list of items or an object wrapping them.
// UNVERIFIED: shape not yet confirmed with a signed-in customer.
type BackendCartResponse =
  | BackendCartItem[]
  | { items?: BackendCartItem[]; results?: BackendCartItem[]; cart_items?: BackendCartItem[]; data?: { items?: BackendCartItem[] } | BackendCartItem };

function cartItemsFrom(response: BackendCartResponse | null): BackendCartItem[] {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  const nested = response.data;
  return response.items ?? response.results ?? response.cart_items ?? (nested && !Array.isArray(nested) && "cart_item_id" in nested ? [nested] : nested && !Array.isArray(nested) ? nested.items ?? [] : []);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [clearError, setClearError] = useState("");
  const [cartError, setCartError] = useState("");
  const [cartErrorProductId, setCartErrorProductId] = useState<string | null>(null);
  const [backendLoading, setBackendLoading] = useState(true);
  const [backendError, setBackendError] = useState("");
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

  // Only the guest (signed-out) cart lives in localStorage; the backend owns the cart after sign-in.
  useEffect(() => {
    if (!loaded || isAuthenticated()) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, promoCode }));
    } catch {
      // Storage may be unavailable (private mode); the cart still works in memory.
    }
  }, [items, promoCode, loaded]);

  // ---- Authenticated cart (logged in) ----

  // Items added before signing in are pushed to the backend once, then the guest cart is cleared.
  async function mergeGuestCart() {
    let guest: StoredCart | null = null;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      guest = saved ? (JSON.parse(saved) as StoredCart) : null;
    } catch {
      guest = null;
    }
    if (!guest?.items?.length) return;
    for (const item of guest.items) {
      try {
        await authApiFetch("/cart/items/", {
          method: "POST",
          body: JSON.stringify({ product_id: Number(item.productId), quantity: item.quantity }),
        });
      } catch {
        // A product may no longer exist; skip it and keep merging the rest.
      }
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors.
    }
  }

  const loadBackendCart = useCallback(async () => {
    setBackendLoading(true);
    setBackendError("");
    try {
      await mergeGuestCart();
      const response = await authApiFetch<BackendCartResponse>("/cart/");
      const mapped: CartItem[] = [];
      const map: Map<string, number> = new Map();
      for (const item of cartItemsFrom(response)) {
        if (!item?.product) continue;
        const productId = String(item.product.product_id);
        mapped.push({ productId, quantity: item.quantity });
        map.set(productId, item.cart_item_id);
      }
      setItems(mapped);
      setCartItemIdMap(map);
    } catch (error) {
      setBackendError(cartFailureMessage(error));
    } finally {
      setBackendLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) { setBackendLoading(false); return; }
    void loadBackendCart();
  }, [loadBackendCart]);

  // ---- Shared mutations ----

  async function addItem(item: CartItem): Promise<boolean> {
    setCartError("");
    setCartErrorProductId(null);
    if (isAuthenticated()) {
      try {
          const payload = await authApiFetch<BackendCartItem | { data?: BackendCartItem }>("/cart/items/", {
            method: "POST",
            body: JSON.stringify({ product_id: Number(item.productId), quantity: item.quantity }),
          });
          const response: BackendCartItem | null = payload && "data" in payload ? payload.data ?? null : payload as BackendCartItem | null;
          if (response?.cart_item_id !== undefined) {
            setCartItemIdMap((m) => new Map(m).set(item.productId, response.cart_item_id));
          }
          setItems((current) => {
            const existing = current.find((i) => i.productId === item.productId);
            if (existing) {
              return current.map((i) =>
                i.productId === item.productId ? { ...i, quantity: response?.quantity ?? i.quantity + item.quantity } : i
              );
            }
            return [...current, { productId: item.productId, quantity: response?.quantity ?? item.quantity }];
          });
        return true;
      } catch (error) {
        setCartError(cartFailureMessage(error));
        setCartErrorProductId(item.productId);
        return false;
      }
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
    return true;
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
        } catch (error) {
          setCartError(cartFailureMessage(error));
          setCartErrorProductId(productId);
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
            const next = new Map(m);
            next.delete(productId);
            return next;
          });
        } catch (error) {
          setCartError(cartFailureMessage(error));
          setCartErrorProductId(productId);
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

  async function clearCart() {
    setClearError("");
    if (isAuthenticated()) {
      try {
        try {
          await authApiFetch("/cart/clear/", { method: "DELETE" });
        } catch (error) {
          if (!(error instanceof ApiError) || error.status !== 405) throw error;
          await authApiFetch("/cart/clear/", { method: "POST" });
        }
      } catch (error) {
        setClearError(cartFailureMessage(error));
        return;
      }
    } else {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* Continue with the in-memory guest cart. */ }
    }
    setItems([]);
    setCartItemIdMap(new Map());
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
        reload: loadBackendCart,
        totalQuantity,
        clearError,
        cartError,
        cartErrorProductId,
        backendLoading,
        backendError,
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
