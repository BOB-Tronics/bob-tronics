import Image from "next/image";
import type { ReactNode } from "react";
import type { CartLine } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import Card from "@/components/ui/Card";

interface Totals {
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
}

// Shared by the cart page and every checkout step.
export default function OrderSummary({
  lines,
  totals,
  promoCode,
  footer,
}: {
  lines: CartLine[];
  totals: Totals;
  promoCode: string | null;
  footer?: ReactNode;
}) {
  return (
    <Card>
      <h2 className="text-xl font-bold text-ink">Order summary</h2>
      <ul className="mt-5 space-y-4">
        {lines.map(({ item, product, lineTotal }) => (
          <li key={product.id} className="flex gap-4">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={112}
              height={112}
              className="h-24 w-24 shrink-0 rounded-lg object-cover sm:h-28 sm:w-28"
            />
            <div className="min-w-0">
              <p className="font-semibold text-ink">{product.name}</p>
              <p className="mt-1 text-sm text-muted">
                {[item.finish, item.configuration].filter(Boolean).join(" · ") || product.summary} · Qty{" "}
                {item.quantity}
              </p>
              <p className="mt-2 font-semibold text-ink">{formatPrice(lineTotal)}</p>
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-3 text-ink">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatPrice(totals.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Delivery</dt>
          <dd>{formatPrice(totals.delivery)}</dd>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between text-success">
            <dt>{promoCode}</dt>
            <dd>− {formatPrice(totals.discount)}</dd>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-line pt-3">
          <dt className="text-lg font-bold">Total</dt>
          <dd className="text-2xl font-bold">{formatPrice(totals.total)}</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm text-muted">Taxes included. Payments are encrypted and secure.</p>
      {footer && <div className="mt-5">{footer}</div>}
    </Card>
  );
}
