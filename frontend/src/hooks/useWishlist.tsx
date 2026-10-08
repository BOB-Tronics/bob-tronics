"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { wishlistProductIds } from "@/lib/mock-data";

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
  const [ids, setIds] = useState<string[]>(wishlistProductIds);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // Restoring from localStorage on mount is the one place we set state in an effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setIds(JSON.parse(saved));
    } catch {
      // Fall back to the default list.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
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
    setIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  }

  function remove(productId: string) {
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
