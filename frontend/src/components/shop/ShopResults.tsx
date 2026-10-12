"use client";

import { useState } from "react";
import type { Category, CategorySlug, Product } from "@/types";
import ProductGrid from "@/components/product/ProductGrid";
import Button from "@/components/ui/Button";
import { CloseIcon, GridIcon } from "@/components/ui/Icons";
import FilterSidebar, { type Filters } from "./FilterSidebar";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

export default function ShopResults({
  products,
  categories,
  initialCategory,
  search,
}: {
  products: Product[];
  categories: Category[];
  initialCategory?: CategorySlug;
  search?: string;
}) {
  const [filters, setFilters] = useState<Filters>({
    categories: initialCategory ? [initialCategory] : [],
    brands: [],
    inStockOnly: false,
    minRating: 0,
  });
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const visible = products
    .filter((p) => filters.categories.length === 0 || filters.categories.includes(p.category))
    .filter((p) => filters.brands.length === 0 || filters.brands.includes(p.brand))
    .filter((p) => !filters.inStockOnly || p.stock !== "pre-order")
    .filter((p) => p.rating >= filters.minRating)
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return 0;
    });

  const activeChips = [
    ...filters.categories.map((slug) => ({
      label: categories.find((c) => c.slug === slug)?.name ?? slug,
      remove: () => setFilters({ ...filters, categories: filters.categories.filter((c) => c !== slug) }),
    })),
    ...filters.brands.map((brand) => ({
      label: brand,
      remove: () => setFilters({ ...filters, brands: filters.brands.filter((b) => b !== brand) }),
    })),
    ...(filters.inStockOnly
      ? [{ label: "In stock", remove: () => setFilters({ ...filters, inStockOnly: false }) }]
      : []),
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:items-start">
      <div className="lg:hidden">
        <Button variant="secondary" fullWidth onClick={() => setFiltersOpen((open) => !open)}>
          {filtersOpen ? "Hide filters" : `Filters${activeChips.length ? ` (${activeChips.length})` : ""}`}
        </Button>
      </div>
      <div className={filtersOpen ? "block" : "hidden lg:block"}>
        <FilterSidebar categories={categories} products={products} filters={filters} onChange={setFilters} />
      </div>

      <div className="min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-ink">
            Showing {visible.length === 0 ? 0 : 1}–{visible.length} of {products.length} products
            {search && <span className="font-normal text-muted"> for “{search}”</span>}
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="sr-only">
              Sort products
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-11 rounded-lg border border-line bg-white px-3 text-sm font-semibold text-primary focus:border-primary focus:outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  Sort: {option.label}
                </option>
              ))}
            </select>
            <span className="hidden h-11 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-semibold text-ink sm:inline-flex">
              <GridIcon size={16} /> Grid
            </span>
          </div>
        </div>

        {activeChips.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {activeChips.map((chip) => (
              <button
                key={chip.label}
                onClick={chip.remove}
                className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-primary"
                aria-label={`Remove filter ${chip.label}`}
              >
                {chip.label} <CloseIcon size={14} />
              </button>
            ))}
          </div>
        )}

        <div className="mt-5">
          <ProductGrid products={visible} columns={3} />
        </div>
      </div>
    </div>
  );
}
