"use client";

import { useEffect, useState } from "react";
import OrdersList from "@/components/account/OrdersList";
import EmptyState from "@/components/ui/EmptyState";
import { getOrders } from "@/services/account";
import type { Order } from "@/types";

// Orders need the browser's tokens, so they are loaded on the client.
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getOrders()
      .then((list) => {
        if (!cancelled) setOrders(list);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "We could not load your orders.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="rounded-2xl border border-line bg-white p-6 text-muted">Loading your orders...</p>;
  }
  if (error) {
    return <EmptyState title="Something went wrong" description={error} />;
  }

  return <OrdersList orders={orders} />;
}
