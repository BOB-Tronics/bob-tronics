import Link from "next/link";
import type { Order } from "@/types";
import { formatDate, formatPrice } from "@/lib/format";
import { ArrowRightIcon } from "@/components/ui/Icons";
import OrderStatusBadge from "./OrderStatusBadge";

function describeItems(order: Order) {
  return order.items.map((item) => `${item.name} ×${item.quantity}`).join(", ");
}

// Table on larger screens, stacked cards on phones.
export default function OrdersTable({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return <p className="rounded-xl border border-line p-6 text-center text-muted">No orders match this view.</p>;
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/account/orders/${order.id}`}
            className="block rounded-xl border border-line p-4 hover:border-primary"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-bold text-ink">{order.id}</p>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="mt-2 text-sm text-ink">{describeItems(order)}</p>
            <div className="mt-2 flex items-center justify-between text-sm text-muted">
              <span>{formatDate(order.date)}</span>
              <span className="font-semibold text-ink">{formatPrice(order.total)}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-line md:block">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs font-medium text-muted">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-4 font-bold text-ink">{order.id}</td>
                <td className="px-4 py-4 text-ink">{formatDate(order.date)}</td>
                <td className="px-4 py-4 text-ink">{describeItems(order)}</td>
                <td className="px-4 py-4 text-ink">{formatPrice(order.total)}</td>
                <td className="px-4 py-4 text-ink">{order.status}</td>
                <td className="px-4 py-4">
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                  >
                    View order <ArrowRightIcon size={14} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
