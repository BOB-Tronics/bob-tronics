"use client";

import Button from "@/components/ui/Button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="page-container py-12">
      <div role="alert" className="rounded-2xl border border-line bg-white p-6 text-muted">
        <p>We could not load this page. Please try again.</p>
        <Button type="button" onClick={reset} className="mt-4">Retry</Button>
      </div>
    </div>
  );
}
