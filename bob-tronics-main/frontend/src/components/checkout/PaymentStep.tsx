"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input, { Select } from "@/components/ui/Input";

export interface PaymentDetails {
  method: "momo" | "card";
  provider: string;
  phone: string;
  accountName: string;
}

const providers = [
  { value: "MTN Mobile Money", label: "MTN Mobile Money" },
  { value: "Airtel Money", label: "Airtel Money" },
];

export default function PaymentStep({
  initial,
  total,
  onBack,
  onPay,
}: {
  initial: PaymentDetails;
  total: number;
  onBack: () => void;
  onPay: (details: PaymentDetails) => Promise<void>;
}) {
  const [form, setForm] = useState(initial);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentDetails, string>>>({});
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  function update<K extends keyof PaymentDetails>(key: K, value: PaymentDetails[K]) {
    setForm({ ...form, [key]: value });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next: typeof errors = {};
    if (form.method === "momo") {
      if (form.phone.replace(/\D/g, "").length < 9) next.phone = "Enter the Mobile Money number to charge.";
      if (!form.accountName.trim()) next.accountName = "Enter the name on the Mobile Money account.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPaying(true);
    setPayError("");
    try {
      await onPay(form);
    } catch {
      setPayError("Payment could not be started. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold text-ink">Payment</h2>
      <p className="mt-2 text-muted">
        Pay {formatPrice(total)} securely. Your order is placed after payment is confirmed.
      </p>

      <div className="mt-5 flex gap-2" role="tablist">
        {(["momo", "card"] as const).map((method) => (
          <button
            key={method}
            type="button"
            role="tab"
            aria-selected={form.method === method}
            onClick={() => update("method", method)}
            className={`h-11 rounded-lg border px-4 text-sm font-semibold ${
              form.method === method ? "border-primary bg-accent text-primary" : "border-line bg-white text-muted"
            }`}
          >
            {method === "momo" ? "Mobile Money" : "Card"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        {form.method === "momo" ? (
          <>
            <Select
              label="Provider"
              name="provider"
              options={providers}
              value={form.provider}
              onChange={(e) => update("provider", e.target.value)}
            />
            <Input
              label="Mobile Money number"
              name="momoPhone"
              type="tel"
              required
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              error={errors.phone}
              hint="A payment prompt will be sent to this number."
            />
            <Input
              label="Account name"
              name="accountName"
              required
              value={form.accountName}
              onChange={(e) => update("accountName", e.target.value)}
              error={errors.accountName}
            />
            <div className="rounded-xl bg-accent p-4">
              <p className="font-semibold text-primary">Approve on your phone</p>
              <p className="mt-1 text-sm text-muted">
                Keep your phone nearby. Enter your PIN only on your phone, never on this website.
              </p>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-line bg-surface p-5 text-sm text-muted">
            Card payments open a secure payment page provided by our payment partner. No card details are
            entered on this website.
          </div>
        )}

        <label className="flex items-start gap-2.5 text-ink">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 accent-primary"
          />
          <span>I agree with the Terms of Sale and Privacy Policy</span>
        </label>

        {payError && <p className="text-sm text-red-600">{payError}</p>}

        <Button type="submit" size="lg" fullWidth disabled={!agreed} loading={paying}>
          Pay {formatPrice(total)}
        </Button>
        <Button type="button" variant="secondary" onClick={onBack} disabled={paying}>
          ← Back to Delivery
        </Button>
      </form>
    </Card>
  );
}
