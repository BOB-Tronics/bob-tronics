"use client";

import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate, formatPrice } from "@/lib/format";
import { ApiError } from "@/lib/api";
import { getService } from "@/services/services";
import type { ServiceRequest } from "@/types";

// One of the signed-in customer's IT requests (GET /services/{service_id}/).
export default function AccountItRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<ServiceRequest | null | undefined>(undefined);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getService(id)
      .then((item) => {
        if (!cancelled) setRequest(item);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setRequest(null);
          return;
        }
        setError(err instanceof Error ? err.message : "We could not load this request.");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) return <EmptyState title="Something went wrong" description={error} />;
  if (request === undefined) {
    return <p className="rounded-2xl border border-line bg-white p-6 text-muted">Loading request...</p>;
  }
  if (request === null) notFound();

  return (
    <>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-xl font-bold text-ink">
            {request.service} · #{request.id}
          </h2>
          <Badge>{request.status}</Badge>
        </div>
        <p className="mt-2 text-muted">
          Requested {request.date ? formatDate(request.date) : "—"}
          {request.serviceType ? ` · ${request.serviceType}` : ""}
        </p>
        <p className="mt-5 whitespace-pre-line text-ink/80">{request.description || "No description provided."}</p>
        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted">Estimated cost</dt>
            <dd className="mt-1 font-semibold text-ink">
              {request.estimatedCost ? formatPrice(Number(request.estimatedCost)) : "To be confirmed"}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Final cost</dt>
            <dd className="mt-1 font-semibold text-ink">
              {request.finalCost ? formatPrice(Number(request.finalCost)) : "—"}
            </dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" href="/account/it-requests">
            Back to IT requests
          </Button>
          <Button variant="secondary" href="/account/support">
            Get help with this request
          </Button>
        </div>
      </Card>
    </>
  );
}
