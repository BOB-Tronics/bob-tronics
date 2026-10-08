"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import Button from "@/components/ui/Button";
import Rating from "@/components/ui/Rating";
import StockStatus from "./StockStatus";
import { BagIcon, HeartIcon } from "@/components/ui/Icons";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const wishlist = useWishlist();
  const [added, setAdded] = useState(false);
  const href = `/shop/${product.slug}`;

  function handleAdd() {
    addItem({ productId: product.id, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="flex h-full flex-col rounded-2xl border border-line/70 bg-white p-4 shadow-card">
      <div className="relative">
        <Link href={href} className="block overflow-hidden rounded-xl bg-surface">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={600}
            height={600}
            className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </Link>
        <button
          onClick={() => wishlist.toggle(product.id)}
          aria-pressed={wishlist.has(product.id)}
          aria-label={wishlist.has(product.id) ? "Remove from wishlist" : "Save to wishlist"}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow"
        >
          <HeartIcon size={18} filled={wishlist.has(product.id)} />
        </button>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{product.brand}</p>
        <h3 className="mt-1.5 text-lg font-semibold text-ink">
          <Link href={href} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted">{product.summary}</p>
        <Rating value={product.rating} count={product.reviewCount} className="mt-2" />
        <p className="mt-3 text-2xl font-bold text-ink">{formatPrice(product.price)}</p>
        <StockStatus status={product.stock} className="mt-1.5" />

        <div className="mt-auto pt-4">
          <Button fullWidth onClick={handleAdd} aria-live="polite">
            <BagIcon size={18} /> {added ? "Added to cart" : "Add to Cart"}
          </Button>
          <div className="mt-3 flex items-center justify-between text-sm font-medium text-primary">
            <Link href={href} className="hover:underline">
              Quick View
            </Link>
            <Link href={href} className="hover:underline">
              Compare +
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
