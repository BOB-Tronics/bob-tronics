"use client";

import { useState } from "react";
import type { Order } from "@/types";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import PillTabs from "@/components/ui/PillTabs";
import OrdersTable from "./OrdersTable";

const inProgress = ["Processing", "Packed", "Out for delivery"];

// Tabs + search on top of the orders table. Filtering happens on the client
// because the full (small) list is already loaded.
export default function OrdersList({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState("All orders");
  const [query, setQuery] = useState("");

  const counts = {
    "All orders": orders.length,
    "In progress": orders.filter((o) => inProgress.includes(o.status)).length,
    Delivered: orders.filter((o) => o.status === "Delivered").length,
    Cancelled: orders.filter((o) => o.status === "Cancelled").length,
  };
  const tabs = Object.entries(counts).map(([label, count]) => `${label} (${count})`);
  const activeTab = `${filter} (${counts[filter as keyof typeof counts]})`;

  const visible = orders.filter((order) => {
    const matchesFilter =
      filter === "All orders" ||
      (filter === "In progress" && inProgress.includes(order.status)) ||
      order.status === filter;
    const text = `${order.id} ${order.items.map((i) => i.name).join(" ")}`.toLowerCase();
    return matchesFilter && text.includes(query.toLowerCase());
  });

  return (
    <>
      <PillTabs tabs={tabs} active={activeTab} onChange={(tab) => setFilter(tab.replace(/ \(\d+\)$/, ""))} />
      <Input
        label="Search orders"
        name="order-search"
        placeholder="Enter order number or product"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Card>
        <h2 className="mb-5 text-xl font-bold text-ink">Order history</h2>
        <OrdersTable orders={visible} />
      </Card>
      <p className="text-sm text-muted">
        Showing {visible.length === orders.length ? "all" : ""} {visible.length} of {orders.length} orders ·
        Download invoices from order details.
      </p>
    </>
  );
}
