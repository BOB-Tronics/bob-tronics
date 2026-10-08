"use client";

import type { Category, CategorySlug, Product } from "@/types";
import { formatPrice } from "@/lib/format";

export interface Filters {
  categories: CategorySlug[];
  brands: string[];
  inStockOnly: boolean;
  minRating: number;
}

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function FilterSidebar({
  categories,
  products,
  filters,
  onChange,
}: {
  categories: Category[];
  products: Product[];
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  const brands = Array.from(new Set(products.map((p) => p.brand))).sort();
  const prices = products.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return (
    <aside className="rounded-2xl border border-line/70 bg-white p-5 shadow-card">
      <h2 className="text-lg font-bold text-ink">Filters</h2>

      <FilterGroup title="Category">
        {categories.map((category) => (
          <Checkbox
            key={category.slug}
            label={`${category.name} (${category.count})`}
            checked={filters.categories.includes(category.slug)}
            onChange={() =>
              onChange({ ...filters, categories: toggleValue(filters.categories, category.slug) })
            }
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Brand">
        {brands.map((brand) => (
          <Checkbox
            key={brand}
            label={brand}
            checked={filters.brands.includes(brand)}
            onChange={() => onChange({ ...filters, brands: toggleValue(filters.brands, brand) })}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Price">
        <p className="text-sm text-muted">
          {formatPrice(minPrice)} — {formatPrice(maxPrice)}
        </p>
      </FilterGroup>

      <FilterGroup title="Availability">
        <Checkbox
          label="In stock"
          checked={filters.inStockOnly}
          onChange={() => onChange({ ...filters, inStockOnly: !filters.inStockOnly })}
        />
      </FilterGroup>

      <FilterGroup title="Rating">
        <Checkbox
          label="4 stars & above"
          checked={filters.minRating === 4}
          onChange={() => onChange({ ...filters, minRating: filters.minRating === 4 ? 0 : 4 })}
        />
        <Checkbox
          label="3 stars & above"
          checked={filters.minRating === 3}
          onChange={() => onChange({ ...filters, minRating: filters.minRating === 3 ? 0 : 3 })}
        />
      </FilterGroup>

      <FilterGroup title="Specifications">
        <p className="text-sm text-muted">RAM: 8GB, 16GB, 32GB</p>
        <p className="text-sm text-muted">Storage: 256GB, 512GB, 1TB</p>
        <p className="text-sm text-muted">Processor: Apple M3, Intel i7</p>
      </FilterGroup>
    </aside>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="mt-5">
      <legend className="mb-2 text-sm font-bold text-ink">{title}</legend>
      <div className="space-y-2">{children}</div>
    </fieldset>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-0.5 text-sm text-muted hover:text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-line accent-primary"
      />
      {label}
    </label>
  );
}
