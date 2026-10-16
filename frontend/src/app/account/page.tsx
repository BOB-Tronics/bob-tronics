<<<<<<< HEAD
import AuthPanel from "@/components/account/AuthPanel";
=======
import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import OrdersTable from "@/components/account/OrdersTable";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { formatDate, formatPrice } from "@/lib/format";
import {
  getAddresses,
  getCurrentUser,
  getOrders,
  getServiceRequests,
  getWishlistIds,
} from "@/services/account";
>>>>>>> origin/gisa

export const metadata = { title: "Sign in · BOB TRONICS" };

export default function AccountOverviewPage() {
  return (
<<<<<<< HEAD
    <section className="flex min-h-[calc(100svh-100px)] items-center justify-center bg-[linear-gradient(135deg,#fff_0%,#f4f5f8_52%,#e8ebf2_100%)] px-4 py-10 sm:px-8 lg:min-h-[calc(100svh-116px)]">
      <AuthPanel />
    </section>
=======
    <>
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        <StatCard value={orders.length} label="Orders" />
        <StatCard value={wishlistIds.length} label="Saved products" />
      </div>

      {latest && (
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="text-xl font-bold text-ink">Your latest order</h2>
            <OrderStatusBadge status={latest.status} />
          </div>
          <p className="mt-4 font-semibold text-ink">
            {latest.id} · {latest.items[0]?.name}
          </p>
          <p className="mt-2 text-muted">
            Placed {formatDate(latest.date)} · {formatPrice(latest.total)} · {latest.paymentStatus}
          </p>
          <div className="mt-5 rounded-xl bg-accent p-4">
            <p className="font-semibold text-primary">Estimated delivery · {formatDate(latest.estimatedDelivery)}</p>
            <p className="mt-1 text-sm text-muted">
              Your order is safely packed and awaiting courier collection.
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
              {request.service} · {request.id}
            </p>
            <p className="mt-2 text-muted">
              {request.date} · {request.location}
            </p>
            <Button variant="secondary" href="/it-services" className="mt-5">
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
              {address.street}, {address.city}
              <br />
              {address.code} · {address.phone}
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
>>>>>>> origin/gisa
  );
}
