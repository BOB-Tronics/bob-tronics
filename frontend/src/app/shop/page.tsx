import Link from "next/link";
import ShopResults from "@/components/shop/ShopResults";
import Card from "@/components/ui/Card";
import { ArrowRightIcon, SearchIcon } from "@/components/ui/Icons";
import PageHeader from "@/components/ui/PageHeader";
import { getCategories, getProducts } from "@/services/products";
import { applyPromotions, getActivePromotions } from "@/services/promotions";

export const metadata = { title: "Shop · BOB TRONICS" };
export const dynamic = "force-dynamic";

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const params = await searchParams;
  const search = typeof params.q === "string" ? params.q : undefined;

  const [categories, productList, promotions] = await Promise.all([
    getCategories(),
    getProducts({ search }),
    getActivePromotions(),
  ]);
  const products = applyPromotions(productList, promotions);
  // Only accept a category that really exists in the catalogue.
  const category = categories.find((cat) => cat.slug === params.category)?.slug;
  const highlighted = products.find((p) => p.discount) ?? products[0];

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
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-4 py-3 text-xl font-semibold text-ink hover:bg-accent">
            Shop by category
            <span aria-hidden="true" className="text-primary transition-transform group-open:rotate-180">⌄</span>
          </summary>
          <nav aria-label="Shop by category" className="mt-2 border-l border-line pl-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                aria-current={category === cat.slug ? "page" : undefined}
                className={`mb-1 block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                  category === cat.slug ? "bg-accent text-primary" : "text-ink hover:bg-accent hover:text-primary"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </details>
        {highlighted && (
          <Link
            href={`/shop/${highlighted.id}`}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-primary"
          >
            {highlighted.discount ? "Deal" : "New"}: {highlighted.name} · Explore now <ArrowRightIcon size={16} />
          </Link>
        )}
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
