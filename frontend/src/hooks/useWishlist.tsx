"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { isAuthenticated, authApiFetch } from "@/lib/auth";

const STORAGE_KEY = "bobtronics-wishlist";

interface WishlistContextValue {
  ids: string[];
  has: (productId: string) => boolean;
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  // Starts with the mock wishlist so the account page has content to show.
  const [ids, setIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // ---- LocalStorage wishlist (logged out) ----

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (isAuthenticated()) {
        // Load from backend instead.
        try {
          const response = await authApiFetch<{ wishlist_item_id: number; product: { product_id: number } }[]>(
            "/wishlist/"
          );
          if (!cancelled && response) {
            setIds(response.map((item) => String(item.product.product_id)));
          }
        } catch {
          // Keep empty wishlist on error.
        }
      } else {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (!cancelled && saved) setIds(JSON.parse(saved));
        } catch {
          // Fall back to empty list.
        }
      }
      if (!cancelled) setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
          } catch {
            // Backend error surfaces via caller error handling.
          }
        } else {
          try {
            await authApiFetch("/wishlist/items/", {
              method: "POST",
              body: JSON.stringify({ product_id: Number(productId) }),
            });
            setIds((current) => [...current, productId]);
          } catch {
            // Backend error surfaces via caller error handling.
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
        } catch {
          // Backend error surfaces via caller error handling.
        }
      })();
      return;
    }

    setIds((current) => current.filter((id) => id !== productId));
  }

  return (
    <WishlistContext.Provider value={{ ids, has, toggle, remove }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside WishlistProvider");
  return context;
}
