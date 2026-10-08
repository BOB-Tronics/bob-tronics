"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("saving");
    // Replace with a real subscribe call when the backend exists.
    setTimeout(() => setStatus("done"), 600);
  }

  return (
    <section className="rounded-2xl bg-accent p-6 sm:p-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">Stay one upgrade ahead.</h2>
          <p className="mt-1 text-muted">New arrivals, expert tips and exclusive offers.</p>
        </div>
        {status === "done" ? (
          <p className="font-semibold text-success">Thanks! You&apos;re on the list.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 flex-1 rounded-lg border border-line bg-white px-4 text-base focus:border-primary focus:outline-none sm:w-72"
            />
            <Button type="submit" size="lg" loading={status === "saving"}>
              Subscribe to updates
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
