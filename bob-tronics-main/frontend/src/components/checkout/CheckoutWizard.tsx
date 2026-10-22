"use client";

import { useState } from "react";
import type { Address, Product, User } from "@/types";
import { buildCartLines, getCartTotals } from "@/lib/cart";
import { useCart } from "@/hooks/useCart";
import { placeOrder } from "@/services/checkout";
import OrderSummary from "@/components/cart/OrderSummary";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { CheckIcon } from "@/components/ui/Icons";
import CustomerDetailsStep, { type CustomerDetails } from "./CustomerDetailsStep";
import DeliveryStep, { deliveryMethods, type DeliveryDetails } from "./DeliveryStep";
import PaymentStep, { type PaymentDetails } from "./PaymentStep";
import StepIndicator from "./StepIndicator";

export default function CheckoutWizard({
  products,
  user,
  savedAddress,
}: {
  products: Product[];
  user: User;
  savedAddress?: Address;
}) {
  const cart = useCart();
  const [step, setStep] = useState(0);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [placedLines, setPlacedLines] = useState<ReturnType<typeof buildCartLines>>([]);
  const [orderError, setOrderError] = useState("");

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone,
    country: "Rwanda",
    createAccount: true,
  });
  const [delivery, setDelivery] = useState<DeliveryDetails>({
    recipient: `${user.firstName} ${user.lastName}`,
    street: "",
    city: "",
    digitalAddress: "",
    phone: user.phone,
    method: "standard",
  });
  const [payment, setPayment] = useState<PaymentDetails>({
    method: "momo",
    provider: "MTN Mobile Money",
    phone: user.phone,
    accountName: `${user.firstName} ${user.lastName}`,
  });

  const lines = orderId ? placedLines : buildCartLines(cart.items, products);
  const totals = getCartTotals(lines, cart.promoCode);

  if (lines.length === 0 && !orderId) {
    return (
      <EmptyState
        title="Nothing to check out yet"
        description="Your cart is empty. Add a product to continue."
        action={<Button href="/shop">Browse products</Button>}
      />
    );
  }

  // POST /orders/checkout/ creates the order from the backend cart. Errors (for example
  // an empty backend cart or an expired session) are shown instead of crashing the page.
  async function handlePay(details: PaymentDetails) {
    setPayment(details);
    setOrderError("");
    try {
      const result = await placeOrder({ customer, delivery, payment: details, lines, totals });
      setPlacedLines(lines);
      setOrderId(result.orderId);
      cart.clearCart();
      setStep(3);
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : "We could not place your order. Please try again.");
    }
  }

  const methodLabel = deliveryMethods.find((m) => m.value === delivery.method)?.label;

  return (
    <div className="space-y-6">
      <StepIndicator current={step} />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div>
          {step === 0 && (
            <CustomerDetailsStep
              initial={customer}
              onNext={(details) => {
                setCustomer(details);
                setDelivery((d) => ({ ...d, recipient: d.recipient || details.fullName, phone: d.phone || details.phone }));
                setStep(1);
              }}
            />
          )}
          {step === 1 && (
            <DeliveryStep
              initial={delivery}
              savedAddress={savedAddress}
              onBack={() => setStep(0)}
              onNext={(details) => {
                setDelivery(details);
                setStep(2);
              }}
            />
          )}
          {step === 2 && (
            <>
              <PaymentStep initial={payment} total={totals.total} onBack={() => setStep(1)} onPay={handlePay} />
              {orderError && (
                <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {orderError}
                </p>
              )}
            </>
          )}
          {step === 3 && orderId && (
            <Card>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success-bg text-success">
                <CheckIcon size={28} />
              </span>
              <h2 className="mt-5 text-2xl font-bold text-ink">Order confirmed</h2>
              <p className="mt-2 text-muted">
                Thank you, {customer.fullName.split(" ")[0]}. Your order <span className="font-semibold text-ink">{orderId}</span>{" "}
                is confirmed and a receipt has been sent to {customer.email}.
              </p>
              <p className="mt-4 rounded-xl bg-accent p-4 text-sm text-primary">
                {delivery.method === "pickup"
                  ? "We will message you as soon as your order is ready for pickup."
                  : `Estimated delivery in 2–3 business days to ${delivery.city || "your address"}.`}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button href="/account/orders">Track your order</Button>
                <Button variant="secondary" href="/shop">
                  Continue shopping
                </Button>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <OrderSummary lines={lines} totals={totals} promoCode={cart.promoCode} />
          {step >= 1 && (
            <Card>
              <h2 className="text-xl font-bold text-ink">Delivering to</h2>
              <p className="mt-4 font-semibold text-ink">{delivery.recipient || customer.fullName}</p>
              <p className="mt-2 text-muted">
                {delivery.method === "pickup"
                  ? "Store Pickup · BOB TRONICS Kigali"
                  : [delivery.street, delivery.city, customer.country].filter(Boolean).join(" · ") ||
                    customer.country}
                <br />
                {delivery.phone}
                {methodLabel && step >= 2 && <> · {methodLabel}</>}
              </p>
              {step < 3 && (
                <button
                  onClick={() => setStep(1)}
                  className="mt-4 text-sm font-semibold text-primary hover:underline"
                >
                  Edit delivery details
                </button>
              )}
            </Card>
          )}
          <p className="text-center text-sm text-muted">Need help? Our support team is here for you.</p>
        </div>
      </div>
    </div>
  );
}
