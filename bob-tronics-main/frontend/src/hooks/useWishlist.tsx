"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { BackendWishlistItem } from "@/types";
import { isAuthenticated, authApiFetch } from "@/lib/auth";
import { useCart } from "@/hooks/useCart";

const STORAGE_KEY = "bobtronics-wishlist";

interface WishlistContextValue {
  ids: string[];
  loading: boolean;
  error: string;
  reload: () => void;
  has: (productId: string) => boolean;
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  // Moves a saved product into the cart (POST /wishlist/items/{product_id}/move-to-cart/).
  moveToCart: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

// GET /wishlist/ returns success/data with data.items for a signed-in customer.
type BackendWishlistResponse =
  | BackendWishlistItem[]
  | {
      items?: BackendWishlistItem[];
      results?: BackendWishlistItem[];
      data?: BackendWishlistItem[] | { items?: BackendWishlistItem[]; results?: BackendWishlistItem[] };
    };

function wishlistItemsFrom(response: BackendWishlistResponse | null): BackendWishlistItem[] {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (response.data) return response.data.items ?? response.data.results ?? [];
  return response.items ?? response.results ?? [];
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const cart = useCart();
  const [ids, setIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadAttempt, setReloadAttempt] = useState(0);

  // ---- Load: backend when signed in, localStorage when signed out ----

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      if (isAuthenticated()) {
        try {
          const response = await authApiFetch<BackendWishlistResponse>("/wishlist/");
          if (!cancelled) {
            setIds(wishlistItemsFrom(response).filter((item) => item?.product).map((item) => String(item.product.product_id)));
          }
        } catch (loadError) {
          if (!cancelled) {
            setError(loadError instanceof Error ? loadError.message : "Your wishlist could not be loaded.");
          }
        }
      } else {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (!cancelled && saved) setIds(JSON.parse(saved));
        } catch (loadError) {
          if (!cancelled) {
            setError(loadError instanceof Error ? loadError.message : "Your wishlist could not be loaded.");
          }
        }
      }
      if (!cancelled) {
        setLoaded(true);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reloadAttempt]);

  function reload() {
    setReloadAttempt((attempt) => attempt + 1);
  }

  useEffect(() => {
    if (!loaded) return;
    if (isAuthenticated()) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // Storage unavailable; wishlist still works in memory.
    }
  }, [ids, loaded]);

  function has(productId: string) {
    return ids.includes(productId);
  }

  function toggle(productId: string) {
    if (isAuthenticated()) {
      void (async () => {
        if (ids.includes(productId)) {
          try {
            await authApiFetch(`/wishlist/items/${Number(productId)}/`, {
              method: "DELETE",
            });
            setIds((current) => current.filter((id) => id !== productId));
            setError("");
          } catch (mutationError) {
            setError(mutationError instanceof Error ? mutationError.message : "The wishlist could not be updated.");
          }
        } else {
          try {
            await authApiFetch("/wishlist/items/", {
              method: "POST",
              body: JSON.stringify({ product_id: Number(productId) }),
            });
            setIds((current) => [...current, productId]);
            setError("");
          } catch (mutationError) {
            setError(mutationError instanceof Error ? mutationError.message : "The wishlist could not be updated.");
          }
        }
      })();
      return;
    }

    setIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  }

  function remove(productId: string) {
    if (isAuthenticated()) {
      void (async () => {
        try {
          await authApiFetch(`/wishlist/items/${Number(productId)}/`, {
            method: "DELETE",
          });
          setIds((current) => current.filter((id) => id !== productId));
          setError("");
        } catch (mutationError) {
          setError(mutationError instanceof Error ? mutationError.message : "The wishlist could not be updated.");
        }
      })();
      return;
    }

    setIds((current) => current.filter((id) => id !== productId));
  }

  // Signed in: the backend moves the item and the cart is re-read.
  // Signed out: the product is added to the local cart and removed from the local wishlist.
  async function moveToCart(productId: string) {
    if (isAuthenticated()) {
      await authApiFetch(`/wishlist/items/${Number(productId)}/move-to-cart/`, { method: "POST" });
      setIds((current) => current.filter((id) => id !== productId));
      await cart.reload();
      return;
    }
    if (await cart.addItem({ productId, quantity: 1 })) {
      setIds((current) => current.filter((id) => id !== productId));
    }
  }

  return (
    <WishlistContext.Provider value={{ ids, loading, error, reload, has, toggle, remove, moveToCart }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside WishlistProvider");
  return context;
}
