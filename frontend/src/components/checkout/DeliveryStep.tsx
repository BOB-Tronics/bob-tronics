"use client";

import { useState } from "react";
import type { Address } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { ArrowRightIcon } from "@/components/ui/Icons";

export interface DeliveryDetails {
  recipient: string;
  street: string;
  city: string;
  digitalAddress: string;
  phone: string;
  method: "pickup" | "standard" | "express";
}

export const deliveryMethods = [
  { value: "pickup", label: "Store Pickup", note: "Free · Ready in 2 hours" },
  { value: "standard", label: "Standard Delivery", note: "RWF 80 · 2–3 business days" },
  { value: "express", label: "Express Delivery", note: "RWF 300 · Next business day" },
] as const;

export default function DeliveryStep({
  initial,
  savedAddress,
  onBack,
  onNext,
}: {
  initial: DeliveryDetails;
  savedAddress?: Address;
  onBack: () => void;
  onNext: (details: DeliveryDetails) => void;
}) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof DeliveryDetails, string>>>({});

  function update<K extends keyof DeliveryDetails>(key: K, value: DeliveryDetails[K]) {
    setForm({ ...form, [key]: value });
  }

  function useSavedAddress() {
    if (!savedAddress) return;
    setForm({
      ...form,
      recipient: savedAddress.recipient,
      street: savedAddress.street,
      city: savedAddress.city,
      digitalAddress: savedAddress.code,
      phone: savedAddress.phone,
    });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next: typeof errors = {};
    const needsAddress = form.method !== "pickup";
    if (!form.recipient.trim()) next.recipient = "Who should receive the order?";
    if (needsAddress && !form.street.trim()) next.street = "Please enter a street address.";
    if (needsAddress && !form.city.trim()) next.city = "Please enter your city or region.";
    if (form.phone.replace(/\D/g, "").length < 9) next.phone = "Please enter a valid phone number.";
    setErrors(next);
    if (Object.keys(next).length === 0) onNext(form);
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold text-ink">Delivery</h2>
      {savedAddress && (
        <button
          type="button"
          onClick={useSavedAddress}
          className="mt-4 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-semibold text-primary hover:bg-accent-strong"
        >
          Use saved address · {savedAddress.label}
        </button>
      )}
      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        <Input
          label="Recipient"
          name="recipient"
          required
          value={form.recipient}
          onChange={(e) => update("recipient", e.target.value)}
          error={errors.recipient}
        />
        <Input
          label="Street address"
          name="street"
          value={form.street}
          onChange={(e) => update("street", e.target.value)}
          error={errors.street}
          autoComplete="street-address"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="City / Region"
            name="city"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            error={errors.city}
          />
          <Input
            label="Digital address"
            name="digitalAddress"
            value={form.digitalAddress}
            onChange={(e) => update("digitalAddress", e.target.value)}
            hint="Optional"
          />
        </div>
        <Input
          label="Phone number"
          name="deliveryPhone"
          type="tel"
          required
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          error={errors.phone}
        />

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-ink">Delivery method</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {deliveryMethods.map((method) => (
              <label
                key={method.value}
                className={`flex cursor-pointer flex-col rounded-xl border p-4 ${
                  form.method === method.value ? "border-primary bg-accent" : "border-line bg-white"
                }`}
              >
                <span className="flex items-center gap-2 font-semibold text-ink">
                  <input
                    type="radio"
                    name="method"
                    value={method.value}
                    checked={form.method === method.value}
                    onChange={() => update("method", method.value)}
                    className="h-4 w-4 accent-primary"
                  />
                  {method.label}
                </span>
                <span className="mt-1 text-sm text-muted">{method.note}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="button" variant="secondary" size="lg" onClick={onBack}>
            ← Back
          </Button>
          <Button type="submit" size="lg" className="flex-1">
            Continue to Payment <ArrowRightIcon size={18} />
          </Button>
        </div>
      </form>
    </Card>
  );
}
