"use client";

import { useEffect, useState } from "react";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import OrdersTable from "@/components/account/OrdersTable";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { formatDate, formatPrice } from "@/lib/format";
import { useWishlist } from "@/hooks/useWishlist";
import { getAddresses, getOrders, getServiceRequests } from "@/services/account";
import type { Address, Order, ServiceRequest } from "@/types";

// Account data needs the browser's tokens, so it is loaded on the client.
export default function AccountOverviewPage() {
  const wishlist = useWishlist();
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [orderList, requestList, addressList] = await Promise.all([
          getOrders(),
          getServiceRequests().catch(() => [] as ServiceRequest[]),
          getAddresses().catch(() => [] as Address[]),
        ]);
        if (cancelled) return;
        setOrders(orderList);
        setRequests(requestList);
        setAddresses(addressList);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "We could not load your account.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="rounded-2xl border border-line bg-white p-6 text-muted">Loading your account...</p>;
  }
  if (error) {
    return <EmptyState title="Something went wrong" description={error} />;
  }

  const latest = orders[0];
  const request = requests[0];
  const address = addresses.find((a) => a.isDefault) ?? addresses[0];
  const currentStep = latest?.timeline.find((step) => step.state === "current");

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        <StatCard value={orders.length} label="Orders" />
        <StatCard value={wishlist.ids.length} label="Saved products" />
      </div>

      {latest && (
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="text-xl font-bold text-ink">Your latest order</h2>
            <OrderStatusBadge status={latest.status} />
          </div>
          <p className="mt-4 font-semibold text-ink">
            Order #{latest.id}
            {latest.items[0]?.name ? ` · ${latest.items[0].name}` : ""}
          </p>
          <p className="mt-2 text-muted">
            Placed {formatDate(latest.date)} · {formatPrice(latest.total)}
          </p>
          <div className="mt-5 rounded-xl bg-accent p-4">
            <p className="font-semibold text-primary">
              {latest.estimatedDelivery
                ? `Estimated delivery · ${formatDate(latest.estimatedDelivery)}`
                : "Estimated delivery —"}
            </p>
            <p className="mt-1 text-sm text-muted">
              {currentStep?.note ?? "We will update you as your order progresses."}
            </p>
          </div>
          <Button href={`/account/orders/${latest.id}`} className="mt-5">
            Track Order <ArrowRightIcon size={16} />
          </Button>
        </Card>
      )}

      <Card>
        <h2 className="mb-5 text-xl font-bold text-ink">Recent orders</h2>
        <OrdersTable orders={orders} />
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        {request && (
          <Card>
            <h2 className="text-xl font-bold text-ink">Your IT request</h2>
            <Badge className="mt-4">{request.status}</Badge>
            <p className="mt-4 font-semibold text-ink">
              {request.service} · #{request.id}
            </p>
            <p className="mt-2 text-muted">
              {request.date ? formatDate(request.date) : "—"} · {request.location}
            </p>
            <Button variant="secondary" href={`/account/it-requests/${request.id}`} className="mt-5">
              View request
            </Button>
          </Card>
        )}
        {address && (
          <Card>
            <h2 className="text-xl font-bold text-ink">Default address</h2>
            <p className="mt-4 font-semibold text-ink">
              {address.label} · {address.recipient}
            </p>
            <p className="mt-2 text-muted">
              {[address.street, address.city].filter(Boolean).join(", ")}
              <br />
              {[address.code, address.phone].filter(Boolean).join(" · ")}
            </p>
            <Button variant="secondary" href="/account/addresses" className="mt-5">
              Manage addresses
            </Button>
          </Card>
        )}
      </div>
    </>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <Card>
      <p className="text-4xl font-extrabold text-primary">{value}</p>
      <p className="mt-2 text-muted">{label}</p>
    </Card>
  );
}
