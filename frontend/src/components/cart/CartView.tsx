"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types";
import { buildCartLines, getCartTotals, isValidPromo } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { ArrowRightIcon, CheckIcon, HeartIcon } from "@/components/ui/Icons";
import OrderSummary from "./OrderSummary";

export default function CartView({ products }: { products: Product[] }) {
  const cart = useCart();
  const wishlist = useWishlist();
  const [promoInput, setPromoInput] = useState(cart.promoCode ?? "");
  const [promoError, setPromoError] = useState("");

  const lines = buildCartLines(cart.items, products);
  const totals = getCartTotals(lines, cart.promoCode);

  if (lines.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add a device or accessory and it will show up here."
        action={<Button href="/shop">Start shopping</Button>}
      />
    );
  }

  function applyPromo(event: React.FormEvent) {
    event.preventDefault();
    if (!isValidPromo(promoInput)) {
      setPromoError("That code is not valid. Try WELCOME500.");
      return;
    }
    setPromoError("");
    cart.applyPromo(promoInput);
  }

  function saveForLater(productId: string) {
    if (!wishlist.has(productId)) wishlist.toggle(productId);
    cart.removeItem(productId);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
      <div className="space-y-6">
        <Card>
          <h2 className="text-xl font-bold text-ink">
            Shopping bag · {cart.totalQuantity} {cart.totalQuantity === 1 ? "item" : "items"}
          </h2>
          <ul className="mt-5 divide-y divide-line">
            {lines.map(({ item, product, lineTotal }) => (
              <li key={product.id} className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row">
                <Link href={`/shop/${product.slug}`} className="shrink-0">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={260}
                      height={220}
                      unoptimized={!product.images[0].startsWith("/")}
                      className="h-44 w-full rounded-xl object-cover sm:h-40 sm:w-56"
                    />
                  ) : (
                    <div aria-hidden="true" className="h-44 w-full rounded-xl bg-surface sm:h-40 sm:w-56" />
                  )}
                </Link>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-ink">
                    <Link href={`/shop/${product.slug}`}>{product.name}</Link>
                  </h3>
                  <p className="mt-1 text-muted">
                    {[item.finish, item.configuration].filter(Boolean).join(" · ") || product.summary}
                  </p>
                  <Badge tone="success" className="mt-3">
                    {product.stock === "low-stock" ? "Low stock" : "In stock"}
                  </Badge>
                  <p className="mt-3 text-2xl font-bold text-ink">{formatPrice(lineTotal)}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <QuantityStepper
                      value={item.quantity}
                      onChange={(value) => cart.updateQuantity(product.id, value)}
                    />
                    <Button variant="secondary" onClick={() => cart.removeItem(product.id)}>
                      Remove
                    </Button>
                  </div>
                  <button
                    onClick={() => saveForLater(product.id)}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    <HeartIcon size={16} /> Save to Wishlist
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-ink">Discount code</h2>
          <form onSubmit={applyPromo} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <Input
              label="Promo code"
              name="promo"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              error={promoError}
              className="flex-1"
              placeholder="Enter code"
            />
            {cart.promoCode && cart.promoCode === promoInput.toUpperCase() ? (
              <Button type="button" variant="secondary" size="lg" onClick={cart.removePromo}>
                Applied <CheckIcon size={16} /> · Remove
              </Button>
            ) : (
              <Button type="submit" size="lg" disabled={!promoInput}>
                Apply
              </Button>
            )}
          </form>
          {totals.discount > 0 && (
            <p className="mt-4 rounded-xl bg-success-bg p-4 font-semibold text-success">
              You saved {formatPrice(totals.discount)}
            </p>
          )}
        </Card>

        <Button variant="secondary" href="/shop">
          ← Continue shopping
        </Button>
      </div>

      <OrderSummary
        lines={lines}
        totals={totals}
        promoCode={cart.promoCode}
        footer={
          <Button href="/checkout" fullWidth size="lg">
            Proceed to Checkout <ArrowRightIcon size={18} />
          </Button>
        }
      />
    </div>
  );
}
