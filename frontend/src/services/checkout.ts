// Checkout service: replaces mock placeOrder with real POST /orders/checkout/.
// UNVERIFIED: built from OpenAPI schema; confirm OrderCheckout input and Order response.
import { authApiFetch } from "@/lib/auth";
import { isMockMode } from "@/lib/api";
import type { CartLine } from "@/lib/cart";
import type { CustomerDetails } from "@/components/checkout/CustomerDetailsStep";
import type { DeliveryDetails } from "@/components/checkout/DeliveryStep";
import type { PaymentDetails } from "@/components/checkout/PaymentStep";

export interface PlaceOrderInput {
  customer: CustomerDetails;
  delivery: DeliveryDetails;
  payment: PaymentDetails;
  lines: CartLine[];
  totals: { subtotal: number; delivery: number; discount: number; total: number };
}

export interface PlaceOrderResult {
  orderId: string;
}

// Mock implementation kept for when NEXT_PUBLIC_USE_MOCK=true.
export async function placeOrderMock(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const orderId = `BT-${10000 + Math.floor(Math.random() * 90000)}`;
  console.info("Mock order placed", { orderId, items: input.lines.length, total: input.totals.total });
  return { orderId };
}

// Real backend call: creates an order from current cart items and clears the cart.
// The backend only needs shipping_address, phone, and delivery_method; line items
// come from the authenticated cart.
export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  if (isMockMode()) {
    return placeOrderMock(input);
  }

  const deliveryMethod = input.delivery.method === "pickup" ? "store_pickup" : "standard";

  const response = await authApiFetch<{ order_id: number }>("/orders/checkout/", {
    method: "POST",
    body: JSON.stringify({
      shipping_address: [
        input.delivery.recipient,
        input.delivery.street,
        input.delivery.city,
        input.delivery.phone,
      ].filter(Boolean).join(", "),
      phone: input.delivery.phone,
      delivery_method: deliveryMethod,
    }),
  });

  if (!response) {
    throw new Error("Checkout failed: no order returned");
  }

  return { orderId: String(response.order_id) };
}
