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

export default function ProductCard({
  product,
  onAddToCart,
  addLabel = "Add to Cart",
}: {
  product: Product;
  // Optional override for the add button (the wishlist uses it to "move to cart").
  onAddToCart?: (product: Product) => void | Promise<void>;
  addLabel?: string;
}) {
  const { addItem, cartError, cartErrorProductId } = useCart();
  const wishlist = useWishlist();
  const [added, setAdded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const productImage = product.images[0];
  const href = `/shop/${product.slug}`;

  async function handleAdd() {
    if (onAddToCart) {
      await onAddToCart(product);
    } else {
      if (!(await addItem({ productId: product.id, quantity: 1 }))) return;
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="flex h-full flex-col rounded-2xl border border-line/70 bg-white p-4 shadow-card">
      <div className="relative">
        <Link href={href} className="block overflow-hidden rounded-xl bg-surface">
          {productImage && !imageFailed ? <Image
            src={productImage}
            alt={product.name}
            width={600}
            height={600}
            unoptimized={!productImage.startsWith("/")}
            onError={() => setImageFailed(true)}
            className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          /> : <div role="img" aria-label={`${product.name} image unavailable`} className="flex aspect-square w-full items-center justify-center bg-slate-100 text-slate-400">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/></svg>
          </div>}
        </Link>
        <button
          onClick={() => wishlist.toggle(product.id)}
          aria-pressed={wishlist.has(product.id)}
          aria-label={wishlist.has(product.id) ? "Remove from wishlist" : "Save to wishlist"}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow"
        >
          <HeartIcon size={18} filled={wishlist.has(product.id)} />
        </button>
        {product.discount && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
            Save {formatPrice(product.discount.savings)}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{product.brand}</p>
        <h3 className="mt-1.5 text-lg font-semibold text-ink">
          <Link href={href} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted">{product.summary}</p>
        {product.reviewCount > 0 ? (
          <Rating value={product.rating} count={product.reviewCount} className="mt-2" />
        ) : (
          <p className="mt-2 text-sm text-muted">No reviews yet</p>
        )}
        {product.discount ? (
          <p className="mt-3 text-2xl font-bold text-ink">
            {formatPrice(product.discount.discountedPrice)}{" "}
            <span className="text-base font-medium text-muted line-through">{formatPrice(product.price)}</span>
          </p>
        ) : (
          <p className="mt-3 text-2xl font-bold text-ink">{formatPrice(product.price)}</p>
        )}
        <StockStatus status={product.stock} className="mt-1.5" />

        <div className="mt-auto pt-4">
          <Button fullWidth onClick={handleAdd} aria-live="polite">
            <BagIcon size={18} /> {added ? "Added to cart" : addLabel}
          </Button>
          {cartErrorProductId === product.id && cartError && <p role="alert" className="mt-2 text-sm text-red-600">{cartError}</p>}
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
