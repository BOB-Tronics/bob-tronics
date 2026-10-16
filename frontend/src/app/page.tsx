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

export default async function HomePage() {
  const [categories, products, services, reviews] = await Promise.all([
    getCategories(),
    getProducts(),
    getItServices(),
    getTestimonials(),
  ]);

  const trending = products.filter((p) => p.trending);
  const newArrivals = products.filter((p) => p.newArrival);
  const featured = products.filter((p) => p.featured);

  return (
    <div className="bg-surface">
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
          <SectionHeading title="Featured Products" subtitle="Our specialists’ picks for work and play." />
          <ProductGrid products={featured} />
        </section>

        <section>
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

        <section>
          <SectionHeading title="Reviews from people like you" subtitle="4.9 / 5 average · 128 verified reviews" />
          <ReviewCards reviews={reviews} />
        </section>

        <section>
          <SectionHeading title="Why BOB TRONICS" subtitle="Carefully chosen technology. Confidence at every step." />
          <WhySection />
        </section>

        <Newsletter />
      </div>
    </div>
  );
}
