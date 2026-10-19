"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { formatDate } from "@/lib/format";
import { getServices } from "@/services/services";
import type { ServiceRequest } from "@/types";

// The signed-in customer's IT service requests (GET /services/).
export default function AccountItRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getServices()
      .then((list) => {
        if (!cancelled) setRequests(list);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "We could not load your requests.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="rounded-2xl border border-line bg-white p-6 text-muted">Loading your IT requests...</p>;
  }
  if (error) {
    return <EmptyState title="Something went wrong" description={error} />;
  }
  if (requests.length === 0) {
    return (
      <EmptyState
        title="No IT requests yet"
        description="Request a service and it will show up here."
        action={<Button href="/it-services/request">Request IT service</Button>}
      />
    );
  }

  return (
    <Card>
      <h2 className="mb-5 text-xl font-bold text-ink">Your IT requests</h2>
      <ul className="divide-y divide-line">
        {requests.map((request) => (
          <li key={request.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-ink">
                {request.service} · #{request.id}
              </p>
              <p className="mt-1 text-sm text-muted">
                {request.date ? formatDate(request.date) : "—"}
                {request.serviceType ? ` · ${request.serviceType}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge>{request.status}</Badge>
              <Link
                href={`/account/it-requests/${request.id}`}
                className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
              >
                View <ArrowRightIcon size={14} />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
