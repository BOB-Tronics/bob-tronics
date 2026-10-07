import { notFound } from "next/navigation";
import AccountShell from "@/components/account/AccountShell";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { formatPrice } from "@/lib/format";
import { getAddresses, getCurrentUser, getOrders } from "@/services/account";

// Simple account sections that share one page template.
const sections: Record<string, { title: string; description: string }> = {
  addresses: { title: "Addresses", description: "Where we deliver your orders." },
  payments: { title: "Payments", description: "Your recent payments and saved methods." },
  profile: { title: "Profile", description: "Your personal details." },
  notifications: { title: "Notifications", description: "Order updates and offers." },
  support: { title: "Support", description: "We are here to help with any order or device." },
};

export default async function AccountSectionPage({ params }: PageProps<"/account/[section]">) {
  const { section } = await params;
  const config = sections[section];
  if (!config) notFound();

  const [user, addresses, orders] = await Promise.all([getCurrentUser(), getAddresses(), getOrders()]);

  return (
    <AccountShell title={config.title}>
      <Card>
        <p className="text-muted">{config.description}</p>

        {section === "addresses" && (
          <ul className="mt-5 space-y-4">
            {addresses.map((address) => (
              <li key={address.id} className="rounded-xl border border-line p-4">
                <p className="font-semibold text-ink">
                  {address.label} · {address.recipient}
                  {address.isDefault && <span className="ml-2 text-xs font-medium text-primary">Default</span>}
                </p>
                <p className="mt-1 text-muted">
                  {address.street}, {address.city} · {address.code}
                </p>
                <p className="text-muted">{address.phone}</p>
              </li>
            ))}
          </ul>
        )}

        {section === "payments" && (
          <ul className="mt-5 divide-y divide-line">
            {orders.map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-semibold text-ink">{order.paymentMethod}</p>
                  <p className="text-sm text-muted">
                    {order.id} · Ref {order.paymentReference}
                  </p>
                </div>
                <p className="font-semibold text-ink">{formatPrice(order.total)}</p>
              </li>
            ))}
          </ul>
        )}

        {section === "profile" && (
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <ProfileField label="First name" value={user.firstName} />
            <ProfileField label="Last name" value={user.lastName} />
            <ProfileField label="Email" value={user.email} />
            <ProfileField label="Phone" value={user.phone} />
          </dl>
        )}

        {section === "notifications" && (
          <ul className="mt-5 space-y-3">
            <li className="rounded-xl bg-accent p-4 text-ink">
              <p className="font-semibold text-primary">Order BT-10482 is packed</p>
              <p className="mt-1 text-sm text-muted">Estimated delivery 03 Oct 2026.</p>
            </li>
            <li className="rounded-xl border border-line p-4 text-ink">
              <p className="font-semibold">Your IT request is scheduled</p>
              <p className="mt-1 text-sm text-muted">Network & Setup · 06 Oct 2026 · 10:00 AM.</p>
            </li>
          </ul>
        )}

        {section === "support" && (
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button href="/contact">Contact support</Button>
            <Button variant="secondary" href="/account/orders">
              Help with an order
            </Button>
          </div>
        )}
      </Card>
    </AccountShell>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 font-medium text-ink">{value}</dd>
    </div>
  );
}
