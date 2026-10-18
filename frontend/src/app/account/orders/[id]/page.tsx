"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import OrderTimeline from "@/components/account/OrderTimeline";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate, formatPrice } from "@/lib/format";
import { cancelOrder, getOrder } from "@/services/account";
import { getDeliveryForOrder, type DeliveryTracking } from "@/services/deliveries";
import type { Order } from "@/types";

const cancellableStatuses = ["Processing", "Packed"];

// Order details need the browser's tokens, so they are loaded on the client.
export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [delivery, setDelivery] = useState<DeliveryTracking | null>(null);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [loadedOrder, loadedDelivery] = await Promise.all([
          getOrder(id),
          getDeliveryForOrder(id).catch(() => null),
        ]);
        if (cancelled) return;
        setOrder(loadedOrder ?? null);
        setDelivery(loadedDelivery);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "We could not load this order.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleCancel() {
    if (!order || !window.confirm(`Cancel order #${order.id}?`)) return;
    setCancelling(true);
    setCancelMessage("");
    try {
      const updated = await cancelOrder(order.id);
      if (updated) setOrder(updated);
      setCancelMessage("Your order has been cancelled.");
    } catch (err) {
      setCancelMessage(err instanceof Error ? err.message : "This order could not be cancelled.");
    } finally {
      setCancelling(false);
    }
  }

  if (error) return <EmptyState title="Something went wrong" description={error} />;
  if (order === undefined) {
    return <p className="rounded-2xl border border-line bg-white p-6 text-muted">Loading order...</p>;
  }
  if (order === null) notFound();

  const canCancel = cancellableStatuses.includes(order.status);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <OrderStatusBadge status={order.status} />
        <Badge tone="success">{order.paymentStatus === "Paid" ? "Payment received" : "Payment pending"}</Badge>
        {delivery && <Badge tone="accent">Delivery · {delivery.statusDisplay}</Badge>}
      </div>

      <Card>
        <h2 className="text-xl font-bold text-ink">Order details</h2>
        <p className="mt-2 text-muted">
          Placed {formatDate(order.placedAt)}
          {order.estimatedDelivery
            ? ` · Delivery estimated ${formatDate(order.estimatedDelivery)}`
            : ` · Status: ${order.rawStatus ?? order.status}`}
        </p>
        <div className="mt-6">
          <OrderTimeline steps={order.timeline} />
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="text-xl font-bold text-ink">Order summary</h2>
          {order.items.length === 0 ? (
            <p className="mt-5 text-muted">Item details are not available for this order.</p>
          ) : (
            <ul className="mt-5 space-y-4">
              {order.items.map((item) => (
                <li key={`${item.productId}-${item.name}`} className="flex gap-4">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={112}
                      height={112}
                      className="h-24 w-24 shrink-0 rounded-lg object-cover sm:h-28 sm:w-28"
                    />
                  ) : (
                    <div aria-hidden="true" className="h-24 w-24 shrink-0 rounded-lg bg-surface sm:h-28 sm:w-28" />
                  )}
                  <div>
                    <p className="font-semibold text-ink">
                      {item.productId ? <Link href={`/shop/${item.productId}`} className="hover:text-primary">{item.name}</Link> : item.name}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {[item.variant, `Qty ${item.quantity}`].filter(Boolean).join(" · ")}
                    </p>
                    <p className="mt-2 font-semibold text-ink">{formatPrice(item.price)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <dl className="mt-6 space-y-3 text-ink">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd>{formatPrice(order.delivery)}</dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-success">
                <dt>{order.discountCode ?? "Discount"}</dt>
                <dd>− {formatPrice(order.discount)}</dd>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-line pt-3">
              <dt className="text-lg font-bold">Total</dt>
              <dd className="text-2xl font-bold">{formatPrice(order.total)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-muted">Taxes included. Payments are encrypted and secure.</p>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-ink">Delivery & Payment</h2>
          <div className="mt-5 space-y-3 text-ink">
            <p className="font-semibold">{order.shippingAddress || delivery?.deliveryAddress || "Address not provided"}</p>
            {order.phone && <p>{order.phone}</p>}
            <p>
              {delivery?.deliveryMethodDisplay || order.deliveryMethod || "Standard delivery"}
              {order.delivery > 0 && ` · ${formatPrice(order.delivery)}`}
            </p>
            {delivery ? (
              <div className="rounded-xl bg-accent p-4 text-sm">
                <p className="font-semibold text-primary">Delivery status · {delivery.statusDisplay}</p>
                {delivery.trackingNumber && (
                  <p className="mt-1 text-muted">
                    Tracking number <span className="font-semibold text-ink">{delivery.trackingNumber}</span> ·{" "}
                    <Link href={`/track?number=${encodeURIComponent(delivery.trackingNumber)}`} className="font-semibold text-primary hover:underline">
                      Track package
                    </Link>
                  </p>
                )}
                {delivery.shippedAt && <p className="mt-1 text-muted">Shipped {formatDate(delivery.shippedAt)}</p>}
                {delivery.deliveredAt && <p className="mt-1 text-muted">Delivered {formatDate(delivery.deliveredAt)}</p>}
              </div>
            ) : (
              <p className="text-sm text-muted">No delivery has been scheduled for this order yet.</p>
            )}
            <p>{order.paymentMethod || "Payment on confirmation"} · {order.paymentStatus}</p>
            {order.paymentReference && <p className="text-sm text-muted">Payment reference {order.paymentReference}</p>}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {canCancel && (
              <Button variant="secondary" onClick={handleCancel} loading={cancelling}>
                Cancel order
              </Button>
            )}
            <Button variant="secondary" href="/account/support">
              Get help with this order
            </Button>
          </div>
          {cancelMessage && <p role="status" className="mt-4 text-sm text-muted">{cancelMessage}</p>}
        </Card>
      </div>
    </>
  );
}
