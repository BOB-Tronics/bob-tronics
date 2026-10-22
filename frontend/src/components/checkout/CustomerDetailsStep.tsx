"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input, { Select } from "@/components/ui/Input";
import { ArrowRightIcon } from "@/components/ui/Icons";

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  createAccount: boolean;
}

const countries = ["Rwanda", "Uganda", "Kenya", "Tanzania", "Ghana"].map((c) => ({ value: c, label: c }));

export default function CustomerDetailsStep({
  initial,
  onNext,
}: {
  initial: CustomerDetails;
  onNext: (details: CustomerDetails) => void;
}) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({});

  function update<K extends keyof CustomerDetails>(key: K, value: CustomerDetails[K]) {
    setForm({ ...form, [key]: value });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next: typeof errors = {};
    if (form.fullName.trim().length < 2) next.fullName = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Please enter a valid email address.";
    if (form.phone.replace(/\D/g, "").length < 9) next.phone = "Please enter a valid phone number.";
    setErrors(next);
    if (Object.keys(next).length === 0) onNext(form);
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold text-ink">Customer Details</h2>
      <p className="mt-2 text-muted">Already have an account? Sign in for a faster checkout.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        <Input
          label="Full name"
          name="fullName"
          required
          value={form.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          error={errors.fullName}
          autoComplete="name"
          placeholder="John Doe"
        />
        <Input
          label="Email address"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          error={errors.email}
          autoComplete="email"
          placeholder="johndoe@gmail.com"
        />
        <Input
          label="Phone number"
          name="phone"
          type="tel"
          required
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          error={errors.phone}
          autoComplete="tel"
        />
        <Select
          label="Country"
          name="country"
          options={countries}
          value={form.country}
          onChange={(e) => update("country", e.target.value)}
        />
        <label className="flex items-center gap-2.5 text-ink">
          <input
            type="checkbox"
            checked={form.createAccount}
            onChange={(e) => update("createAccount", e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Create an account to track your order
        </label>
        <p className="text-sm text-muted">We’ll only use your details for order updates and support.</p>
        <Button type="submit" size="lg" fullWidth>
          Continue to Delivery <ArrowRightIcon size={18} />
        </Button>
      </form>
    </Card>
  );
}
