"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input, { Select } from "@/components/ui/Input";

// Used for both IT service requests and the contact page.
export default function ServiceRequestForm({
  services,
  submitLabel = "Request a service",
}: {
  services?: string[];
  submitLabel?: string;
}) {
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    // Replace with a real API call when the backend exists.
    setTimeout(() => setStatus("done"), 800);
  }

  if (status === "done") {
    return (
      <Card>
        <p className="text-lg font-semibold text-success">Thank you! We have received your request.</p>
        <p className="mt-2 text-muted">A specialist will contact you within one business day.</p>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Full name" name="name" required autoComplete="name" />
          <Input label="Phone number" name="phone" type="tel" required autoComplete="tel" />
        </div>
        <Input label="Email address" name="email" type="email" required autoComplete="email" />
        {services && (
          <Select label="Service" name="service" options={services.map((s) => ({ value: s, label: s }))} />
        )}
        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-semibold text-ink">
            How can we help?
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-base text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <Button type="submit" size="lg" loading={status === "saving"}>
          {submitLabel}
        </Button>
      </form>
    </Card>
  );
}
