import { delay } from "@/lib/api";
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

// Mock implementation. Swap for `fetch(`${API_URL}/orders`, { method: "POST", ... })`.
export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const orderId = `BT-${10000 + Math.floor(Math.random() * 90000)}`;
  console.info("Mock order placed", { orderId, items: input.lines.length, total: input.totals.total });
  return delay({ orderId }, 1200);
}
