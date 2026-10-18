"use client";

import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types";
import { ChevronRightIcon } from "@/components/ui/Icons";

export default function CategoryCards({ categories }: { categories: Category[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/shop?category=${category.slug}`}
          className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-navy sm:aspect-[5/6]"
        >
          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/></svg>
          </div>
          {category.image && <Image
            src={category.image}
            alt=""
            fill
            unoptimized={!category.image.startsWith("/")}
            onError={(event) => { event.currentTarget.style.display = "none"; }}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white">
            <div>
              <p className="text-2xl font-bold">{category.name}</p>
              <p className="mt-1 text-white/85">{category.tagline}</p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur">
              <ChevronRightIcon size={20} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
