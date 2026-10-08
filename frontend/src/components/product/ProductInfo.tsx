"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Rating from "@/components/ui/Rating";
import { BagIcon, CheckIcon, HeartIcon } from "@/components/ui/Icons";
import QuantityStepper from "@/components/ui/QuantityStepper";

const promises = [
  "Genuine product & verified stock",
  "Delivery in Kigali · 2–3 business days",
  "Secure Mobile Money & Card payments",
  "Setup assistance & after-sales support",
];

export default function ProductInfo({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const wishlist = useWishlist();
  const [finish, setFinish] = useState(product.finishes[0]);
  const [config, setConfig] = useState(product.configurations[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const stockLabel =
    product.stock === "in-stock"
      ? `In stock · ${product.stockCount} available`
      : product.stock === "low-stock"
        ? `Low stock · only ${product.stockCount} left`
        : "Pre-order";

  function addToCart() {
    addItem({ productId: product.id, quantity, finish, configuration: config.label });
  }

  function handleAdd() {
    addToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    addToCart();
    router.push("/checkout");
  }

  return (
    <div className="space-y-5">
      <Badge>{product.brand.toUpperCase()} · AUTHORIZED STOCK</Badge>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">{product.name}</h1>
        <p className="mt-3 text-lg text-muted">{product.tagline}</p>
      </div>
      <div className="flex items-center gap-2">
        <Rating value={product.rating} variant="stars" />
        <span className="text-sm font-medium text-star">
          {product.rating.toFixed(1)} · {product.reviewCount} reviews
        </span>
      </div>
      <p className="text-4xl font-bold text-ink">{formatPrice(config.price)}</p>
      <Badge tone={product.stock === "low-stock" ? "warning" : "success"}>{stockLabel}</Badge>
      <p className="text-sm text-muted">
        SKU: {product.sku} · {product.warranty}
      </p>

      <fieldset>
        <legend className="mb-2 font-semibold text-ink">Finish: {finish}</legend>
        <div className="flex flex-wrap gap-2">
          {product.finishes.map((option) => (
            <OptionButton key={option} selected={option === finish} onClick={() => setFinish(option)}>
              <span
                aria-hidden="true"
                className={`h-2.5 w-2.5 rounded-full border ${option === finish ? "bg-primary border-primary" : "border-muted"}`}
              />
              {option}
            </OptionButton>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 font-semibold text-ink">Configuration</legend>
        <div className="flex flex-wrap gap-2">
          {product.configurations.map((option) => (
            <OptionButton
              key={option.label}
              selected={option.label === config.label}
              onClick={() => setConfig(option)}
            >
              {option.label}
            </OptionButton>
          ))}
        </div>
      </fieldset>

      <p className="text-muted">{product.description}</p>

      <div className="flex flex-wrap gap-3">
        <QuantityStepper value={quantity} onChange={setQuantity} />
        <Button variant="secondary" onClick={() => wishlist.toggle(product.id)} aria-pressed={wishlist.has(product.id)}>
          <HeartIcon size={18} filled={wishlist.has(product.id)} /> Wishlist
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button size="lg" onClick={handleAdd}>
          <BagIcon size={18} /> {added ? "Added to cart" : "Add to Cart"}
        </Button>
        <Button size="lg" variant="dark" onClick={handleBuyNow}>
          Buy Now
        </Button>
      </div>

      <ul className="space-y-2 rounded-xl border border-line bg-white p-4 text-sm text-ink">
        {promises.map((text) => (
          <li key={text} className="flex items-center gap-2">
            <CheckIcon size={16} className="text-success" /> {text}
          </li>
        ))}
      </ul>
    </div>
  );
}

function OptionButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex h-11 items-center gap-2 rounded-lg border px-4 text-sm font-semibold ${
        selected ? "border-primary bg-accent text-primary" : "border-line bg-white text-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
