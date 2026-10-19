"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import PageHeader from "@/components/ui/PageHeader";
import { formatDate } from "@/lib/format";
import { trackDelivery, type DeliveryTracking } from "@/services/deliveries";

// Public package tracking (GET /deliveries/track/{tracking_number}/). No sign-in needed.
function TrackForm() {
  const searchParams = useSearchParams();
  const [number, setNumber] = useState(searchParams.get("number") ?? "");
  const [result, setResult] = useState<DeliveryTracking | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function lookup(trackingNumber: string) {
    if (!trackingNumber.trim()) return;
    setLoading(true);
    setError("");
    try {
      setResult(await trackDelivery(trackingNumber));
    } catch (err) {
      setResult(undefined);
      setError(err instanceof Error ? err.message : "We could not look up that package right now.");
    } finally {
      setLoading(false);
    }
  }

  // A tracking link from an order page fills the number in and looks it up at once.
  useEffect(() => {
    const initial = searchParams.get("number");
    if (initial) void lookup(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void lookup(number);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
      <Card>
        <h2 className="text-xl font-bold text-ink">Enter your tracking number</h2>
        <p className="mt-2 text-muted">You will find it on your order page once the package is dispatched.</p>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <Input
            label="Tracking number"
            name="tracking"
            required
            value={number}
            onChange={(event) => setNumber(event.target.value)}
            placeholder="e.g. BT-TRK-000123"
          />
          <Button type="submit" loading={loading}>
            Track package
          </Button>
        </form>
        {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
      </Card>

      {result === null && (
        <Card>
          <h2 className="text-xl font-bold text-ink">Package not found</h2>
          <p className="mt-2 text-muted">
            We could not find a package with that tracking number. Check the number and try again, or sign in to see
            your orders.
          </p>
          <Button variant="secondary" href="/account/orders" className="mt-5">
            View my orders
          </Button>
        </Card>
      )}

      {result && (
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="text-xl font-bold text-ink">Package {result.trackingNumber ?? number}</h2>
            <Badge tone={result.deliveredAt ? "success" : "accent"}>{result.statusDisplay}</Badge>
          </div>
          <dl className="mt-5 space-y-3 text-ink">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Order</dt>
              <dd className="font-semibold">#{result.orderId}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Delivery method</dt>
              <dd className="font-semibold">{result.deliveryMethodDisplay}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Delivering to</dt>
              <dd className="text-right font-semibold">{result.deliveryAddress || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Shipped</dt>
              <dd className="font-semibold">{result.shippedAt ? formatDate(result.shippedAt) : "Not yet"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Delivered</dt>
              <dd className="font-semibold">{result.deliveredAt ? formatDate(result.deliveredAt) : "Not yet"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Last update</dt>
              <dd className="font-semibold">{formatDate(result.updatedAt)}</dd>
            </div>
          </dl>
        </Card>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <div className="page-container pb-12">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Track order" }]}
        title="Track your package"
        subtitle="Follow your delivery from our store to your door."
      />
      <Suspense fallback={<p className="rounded-2xl border border-line bg-white p-6 text-muted">Loading...</p>}>
        <TrackForm />
      </Suspense>
    </div>
  );
}
