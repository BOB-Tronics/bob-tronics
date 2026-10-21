"use client";

import { useCallback, useEffect, useState } from "react";
import CartView from "@/components/cart/CartView";
import ProductGrid from "@/components/product/ProductGrid";
import SectionHeading from "@/components/ui/SectionHeading";
import { getProducts } from "@/services/products";
import type { Product } from "@/types";

export default function CartPageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setProducts(await getProducts());
    } catch {
      setError("Products could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts, attempt]);

  if (loading) return <p role="status" className="rounded-2xl border border-line bg-white p-6 text-muted">Loading cart products…</p>;
  if (error) return <div role="alert" className="rounded-2xl border border-line bg-white p-6 text-muted">{error}<button type="button" onClick={() => setAttempt((value) => value + 1)} className="ml-3 font-semibold text-primary underline">Retry</button></div>;

  return (
    <>
      <CartView products={products} />
      <section className="mt-14">
        <SectionHeading title="Complete your setup" />
        <ProductGrid products={products.filter((product) => product.featured).slice(0, 4)} />
      </section>
    </>
  );
}
