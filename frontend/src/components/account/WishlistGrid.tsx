"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { useWishlist } from "@/hooks/useWishlist";
import { getProductsByIds } from "@/services/products";
import ProductGrid from "@/components/product/ProductGrid";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

export default function WishlistGrid() {
  const {
    ids,
    loading: wishlistLoading,
    error: wishlistError,
    reload: reloadWishlist,
    moveToCart,
  } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moveError, setMoveError] = useState("");
  const [reloadProducts, setReloadProducts] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getProductsByIds(ids)
      .then((list) => {
        if (!cancelled) setProducts(list);
      })
      .catch(() => {
        if (!cancelled) setError("We could not load your wishlist. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ids, reloadProducts]);

  // POST /wishlist/items/{product_id}/move-to-cart/ when signed in.
  async function handleMoveToCart(product: Product) {
    setMoveError("");
    try {
      await moveToCart(product.id);
    } catch (err) {
      setMoveError(err instanceof Error ? err.message : "We could not move that product to your cart.");
    }
  }

  if (wishlistLoading || loading) {
    return <p className="rounded-2xl border border-line bg-white p-6 text-muted">Loading your wishlist...</p>;
  }

  if (wishlistError) {
    return (
      <EmptyState
        title="Something went wrong"
        description={wishlistError}
        action={<Button variant="secondary" onClick={reloadWishlist}>Retry</Button>}
      />
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Something went wrong"
        description={error}
        action={<Button variant="secondary" onClick={() => setReloadProducts((attempt) => attempt + 1)}>Retry</Button>}
      />
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="Tap the heart on any product to save it here."
        action={<Button href="/shop">Browse products</Button>}
      />
    );
  }

  return (
    <>
      <div className="rounded-xl bg-accent p-5">
        <p className="text-lg font-bold text-primary">
          {products.length} {products.length === 1 ? "product" : "products"} you&apos;re keeping an eye on
        </p>
        <p className="mt-1 text-muted">Move an item to your cart whenever you&apos;re ready.</p>
      </div>
      {moveError && <p role="alert" className="text-sm text-red-600">{moveError}</p>}
      <ProductGrid products={products} columns={3} onAddToCart={handleMoveToCart} addLabel="Move to Cart" />
      <Button variant="secondary" href="/shop">
        Continue shopping
      </Button>
    </>
  );
}
