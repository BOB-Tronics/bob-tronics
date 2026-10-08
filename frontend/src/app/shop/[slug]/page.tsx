import { notFound } from "next/navigation";
import ProductGallery from "@/components/product/ProductGallery";
import ProductGrid from "@/components/product/ProductGrid";
import ProductInfo from "@/components/product/ProductInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Rating from "@/components/ui/Rating";
import SectionHeading from "@/components/ui/SectionHeading";
import { formatDate } from "@/lib/format";
import { getCategories, getProduct, getRelatedProducts } from "@/services/products";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "specifications", label: "Specifications" },
  { id: "included", label: "What’s Included" },
  { id: "reviews", label: "Reviews" },
  { id: "faq", label: "FAQ" },
];

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [categories, related] = await Promise.all([getCategories(), getRelatedProducts(product)]);
  const category = categories.find((c) => c.slug === product.category);

  return (
    <div className="page-container pb-12">
      <div className="py-6 sm:py-8">
        <Breadcrumb
          style="soft"
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: category?.name ?? "Products", href: `/shop?category=${product.category}` },
            { label: product.name },
          ]}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <ProductGallery images={product.images} name={product.name} />
        <ProductInfo product={product} />
      </div>

      <nav aria-label="Product sections" className="no-scrollbar -mx-4 mt-12 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {sections.map((section, index) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={`h-11 shrink-0 rounded-lg border px-4 text-sm font-semibold leading-[2.6rem] ${
              index === 0 ? "border-primary bg-accent text-primary" : "border-line bg-white text-muted hover:text-ink"
            }`}
          >
            {section.label}
          </a>
        ))}
      </nav>

      <div className="mt-6 space-y-6">
        <Card id="overview" className="scroll-mt-28">
          <h2 className="text-xl font-bold text-ink">Designed for wherever you’re going.</h2>
          <p className="mt-3 text-lg text-ink/80">{product.description}</p>
          <dl className="mt-8 grid gap-6 sm:grid-cols-3">
            {product.highlights.map((item) => (
              <div key={item.value}>
                <dt className="text-4xl font-extrabold text-primary">{item.value}</dt>
                <dd className="mt-2 text-muted">{item.label}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card id="specifications" className="scroll-mt-28">
          <h2 className="text-xl font-bold text-ink">Specifications</h2>
          <div className="mt-5 overflow-hidden rounded-xl border border-line">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-xs font-medium text-muted">
                <tr>
                  <th className="px-4 py-3">Specification</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {product.specs.map((spec) => (
                  <tr key={spec.label}>
                    <th scope="row" className="w-1/3 px-4 py-4 text-left font-semibold text-ink">
                      {spec.label}
                    </th>
                    <td className="px-4 py-4 text-primary">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card id="included" className="scroll-mt-28">
          <h2 className="text-xl font-bold text-ink">What’s Included</h2>
          <p className="mt-3 text-lg text-ink/80">{product.included.join(" · ")}</p>
        </Card>

        <Card id="reviews" className="scroll-mt-28">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h2 className="text-xl font-bold text-ink">Customer Reviews</h2>
            <Button variant="secondary">Write a review</Button>
          </div>
          <div className="mt-5 flex items-center gap-4">
            <p className="text-5xl font-extrabold text-ink">{product.rating.toFixed(1)}</p>
            <div>
              <Rating value={product.rating} variant="stars" />
              <p className="mt-1 text-muted">{product.reviewCount} verified reviews · 96% recommend</p>
            </div>
          </div>
          <ul className="mt-6 divide-y divide-line">
            {product.reviews.map((review) => (
              <li key={review.id} className="py-4">
                <p className="font-semibold text-ink">{review.author} · Verified purchase</p>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted">
                  <Rating value={review.rating} variant="stars" /> · {formatDate(review.date)}
                </div>
                <p className="mt-2 text-ink/80">{review.text}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card id="faq" className="scroll-mt-28">
          <h2 className="text-xl font-bold text-ink">Frequently Asked Questions</h2>
          <dl className="mt-5 space-y-5">
            {product.faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="font-semibold text-ink">{faq.question}</dt>
                <dd className="mt-1 text-muted">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>

      <section className="mt-14">
        <SectionHeading title="Related Products" subtitle="Complete your setup." />
        <ProductGrid products={related} />
      </section>
    </div>
  );
}
