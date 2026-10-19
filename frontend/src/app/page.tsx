import CategoryCards from "@/components/home/CategoryCards";
import Hero from "@/components/home/Hero";
import Newsletter from "@/components/home/Newsletter";
import ReviewCards from "@/components/home/ReviewsSection";
import ServiceCards from "@/components/home/ServicesSection";
import TrustBar from "@/components/home/TrustBar";
import WhySection from "@/components/home/WhySection";
import ProductGrid from "@/components/product/ProductGrid";
import Button from "@/components/ui/Button";
import { ArrowUpRightIcon } from "@/components/ui/Icons";
import SectionHeading from "@/components/ui/SectionHeading";
import { getItServices, getTestimonials } from "@/services/account";
import { getCategories, getProducts } from "@/services/products";
import { applyPromotions, getActivePromotions } from "@/services/promotions";
import type { Product } from "@/types";

export default async function HomePage() {
  const [categories, productList, services, reviews, promotions] = await Promise.all([
    getCategories(),
    getProducts(),
    getItServices(),
    getTestimonials(),
    getActivePromotions(),
  ]);
  const products = applyPromotions(productList, promotions);

  // The backend has no trending/new/featured flags, so each section falls back to a
  // slice of the catalogue (newest first) and featured prefers products on promotion.
  const flagged = (list: Product[], fallback: Product[]) => (list.length > 0 ? list : fallback);
  const trending = flagged(products.filter((p) => p.trending), products.slice(0, 4));
  const newArrivals = flagged(products.filter((p) => p.newArrival), products.length > 4 ? products.slice(4, 8) : products.slice(0, 4));
  const onPromotion = products.filter((p) => p.discount);
  const showDeals = products.filter((p) => p.featured).length === 0 && onPromotion.length > 0;
  const featured = showDeals
    ? onPromotion.slice(0, 4)
    : flagged(products.filter((p) => p.featured), products.slice(8, 12).length > 0 ? products.slice(8, 12) : products.slice(0, 4));

  const averageRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div>
      <Hero />
      <TrustBar />

      <div className="page-container space-y-16 py-12 sm:space-y-20 sm:py-16">
        <section>
          <SectionHeading title="Find your next upgrade" subtitle="Explore our categories" />
          <CategoryCards categories={categories} />
        </section>

        <section>
          <SectionHeading
            title="Trending Products"
            subtitle="The upgrades everyone is talking about."
            action={
              <Button variant="secondary" href="/shop">
                <ArrowUpRightIcon size={18} /> Shop all products
              </Button>
            }
          />
          <ProductGrid products={trending} />
        </section>

        <section>
          <SectionHeading title="New Arrivals" subtitle="Fresh technology, ready for what’s next." />
          <ProductGrid products={newArrivals} />
        </section>

        <section>
          <SectionHeading
            title={showDeals ? "Deals of the Moment" : "Featured Products"}
            subtitle={showDeals ? "Limited-time savings on selected products." : "Our specialists’ picks for work and play."}
          />
          <ProductGrid products={featured} />
        </section>

        {/* The design places the IT services block inside a white panel. */}
        <section className="rounded-2xl border border-line/70 bg-white p-6 shadow-card sm:p-8">
          <SectionHeading
            title="More than devices. Real solutions."
            subtitle="IT Services that keep you connected and moving."
            action={
              <Button variant="secondary" href="/it-services">
                <ArrowUpRightIcon size={18} /> Explore IT Services
              </Button>
            }
          />
          <ServiceCards services={services} />
        </section>

        {reviews.length > 0 && (
          <section>
            <SectionHeading
              title="Reviews from people like you"
              subtitle={averageRating ? `${averageRating} / 5 average · latest customer reviews` : "Latest customer reviews"}
            />
            <ReviewCards reviews={reviews} />
          </section>
        )}

        <section>
          <SectionHeading title="Why BOB TRONICS" subtitle="Carefully chosen technology. Confidence at every step." />
          <WhySection />
        </section>

        <Newsletter />
      </div>
    </div>
  );
}
