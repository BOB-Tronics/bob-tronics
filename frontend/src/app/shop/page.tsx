import Link from "next/link";
import ShopResults from "@/components/shop/ShopResults";
import Card from "@/components/ui/Card";
import { ArrowRightIcon, SearchIcon } from "@/components/ui/Icons";
import PageHeader from "@/components/ui/PageHeader";
import { getCategories, getProducts } from "@/services/products";
import type { CategorySlug } from "@/types";

export const metadata = { title: "Shop · BOB TRONICS" };

const categorySlugs: CategorySlug[] = ["phones", "laptops", "accessories", "gaming"];

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const params = await searchParams;
  const search = typeof params.q === "string" ? params.q : undefined;
  const category = categorySlugs.find((slug) => slug === params.category);

  const [categories, products] = await Promise.all([getCategories(), getProducts({ search })]);

  return (
    <div className="page-container pb-12">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
        title="Discover your next upgrade."
        subtitle="Genuine technology. Verified stock. A better way to shop."
      />

      <form action="/shop" className="mb-6">
        <label htmlFor="q" className="mb-2 block text-sm font-semibold text-ink">
          Search products
        </label>
        <div className="relative">
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={search}
            placeholder="Search phones, laptops, gaming and more"
            className="h-12 w-full rounded-lg border border-line bg-white pl-4 pr-12 text-base text-ink placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-1.5 top-1.5 flex h-9 w-9 items-center justify-center rounded-md text-primary hover:bg-accent"
          >
            <SearchIcon />
          </button>
        </div>
      </form>

      <Card className="mb-8">
        <h2 className="text-xl font-bold text-ink">Shop by category</h2>
        <div className="mt-5 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {categories.map((cat) => (
            <div key={cat.slug}>
              <Link href={`/shop?category=${cat.slug}`} className="text-lg font-bold text-primary hover:underline">
                {cat.name}
              </Link>
              <ul className="mt-2 space-y-1.5">
                {cat.subcategories.map((sub) => (
                  <li key={sub}>
                    <Link href={`/shop?category=${cat.slug}`} className="text-sm text-muted hover:text-ink">
                      {sub}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Link
          href="/shop/macbook-air-13-m3"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-primary"
        >
          New: MacBook Air M3 · Explore now <ArrowRightIcon size={16} />
        </Link>
      </Card>

      <ShopResults
        key={`${category ?? "all"}-${search ?? ""}`}
        products={products}
        categories={categories}
        initialCategory={category}
        search={search}
      />
    </div>
  );
}
