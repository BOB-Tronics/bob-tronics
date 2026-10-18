"use client";

import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types";
import { ChevronRightIcon } from "@/components/ui/Icons";

// Bundled photos used when a backend category has no image of its own.
const bundledImages: Record<string, string> = {
  phones: "/images/categories/phones.jpg",
  laptops: "/images/categories/laptops.jpg",
  accessories: "/images/categories/accessories.jpg",
  gaming: "/images/categories/gaming.jpg",
};

export default function CategoryCards({ categories }: { categories: Category[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => {
        const image = category.image || bundledImages[category.slug] || "";
        return (
          <Link
            key={category.slug}
            href={`/shop?category=${category.slug}`}
            className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-navy sm:aspect-[14/15]"
          >
            <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400">
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/></svg>
            </div>
            {image && <Image
              src={image}
              alt=""
              fill
              unoptimized={!image.startsWith("/")}
              onError={(event) => { event.currentTarget.style.display = "none"; }}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
              <div className="min-w-0">
                <p className="text-2xl font-bold">{category.name}</p>
                {/* The design shows a one-line tagline; backend descriptions can be long. */}
                <p className="mt-1 line-clamp-2 text-sm text-white/85">{category.tagline}</p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                <ChevronRightIcon size={20} />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
