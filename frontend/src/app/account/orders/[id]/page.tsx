import Image from "next/image";
import { notFound } from "next/navigation";
import AccountShell from "@/components/account/AccountShell";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import OrderTimeline from "@/components/account/OrderTimeline";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { formatDate, formatPrice } from "@/lib/format";
import { getAddresses, getOrder } from "@/services/account";

export default async function OrderDetailPage({ params }: PageProps<"/account/orders/[id]">) {
  const { id } = await params;
  const [order, addresses] = await Promise.all([getOrder(id), getAddresses()]);
  if (!order) notFound();

  const address = addresses.find((a) => a.isDefault) ?? addresses[0];

  return (
    <AccountShell title={`Order ${order.id}`}>
      <div className="flex flex-wrap gap-2">
        <OrderStatusBadge status={order.status} />
        <Badge tone="success">{order.paymentStatus === "Paid" ? "Payment received" : "Payment pending"}</Badge>
      </div>

      <Card>
        <h2 className="text-xl font-bold text-ink">Order details</h2>
        <p className="mt-2 text-muted">
          Placed {order.placedAt} · Delivery estimated {formatDate(order.estimatedDelivery)}
        </p>
        <div className="mt-6">
          <OrderTimeline steps={order.timeline} />
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="text-xl font-bold text-ink">Order summary</h2>
          <ul className="mt-5 space-y-4">
            {order.items.map((item) => (
              <li key={item.productId} className="flex gap-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={112}
                  height={112}
                  className="h-24 w-24 shrink-0 rounded-lg object-cover sm:h-28 sm:w-28"
                />
                <div>
                  <p className="font-semibold text-ink">{item.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    {item.variant} · Qty {item.quantity}
                  </p>
                  <p className="mt-2 font-semibold text-ink">{formatPrice(item.price)}</p>
                </div>
              </li>
            ))}
          </ul>
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
                <dt>{order.discountCode}</dt>
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
            <p className="font-semibold">{address?.recipient}</p>
            <p>
              {address?.city} · {address?.street}
            </p>
            <p>
              {order.deliveryMethod} · {formatPrice(order.delivery)}
            </p>
            <p>
              {order.paymentMethod} · {order.paymentStatus}
            </p>
            <p className="text-sm text-muted">Payment reference {order.paymentReference}</p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button variant="secondary">Download invoice</Button>
            <Button variant="secondary" href="/account/support">
              Get help with this order
            </Button>
          </div>
        </Card>
      </div>
    </AccountShell>
  );
}
