"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CheckoutWizard from "@/components/checkout/CheckoutWizard";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import { isAuthenticated } from "@/lib/auth";
import { getAddresses, getCurrentUser } from "@/services/account";
import { getProducts } from "@/services/products";
import type { Address, Product, User } from "@/types";

// Checkout places the order from the signed-in customer's backend cart, so the
// customer profile is loaded on the client and signed-out visitors are sent to sign in.
export default function CheckoutPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [savedAddress, setSavedAddress] = useState<Address | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/sign-in");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const [productList, profile, addresses] = await Promise.all([
          getProducts(),
          getCurrentUser(),
          getAddresses().catch(() => [] as Address[]),
        ]);
        if (cancelled) return;
        setProducts(productList);
        setUser(profile);
        setSavedAddress(addresses.find((a) => a.isDefault) ?? addresses[0]);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "We could not prepare your checkout.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="page-container pb-12">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "Checkout" }]}
        title="Checkout"
        subtitle="A few simple steps to your next upgrade."
      />
      {loading ? (
        <p className="rounded-2xl border border-line bg-white p-6 text-muted">Preparing your checkout...</p>
      ) : error || !user ? (
        <EmptyState
          title="We could not prepare your checkout"
          description={error || "Please sign in and try again."}
          action={<Button href="/sign-in">Sign in</Button>}
        />
      ) : (
        <CheckoutWizard products={products} user={user} savedAddress={savedAddress} />
      )}
    </div>
  );
}
