import CartView from "@/components/cart/CartView";
import ProductGrid from "@/components/product/ProductGrid";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import { getProducts } from "@/services/products";

export const metadata = { title: "Your Cart · BOB TRONICS" };

export default async function CartPage() {
  const products = await getProducts();

  return (
    <div className="page-container pb-12">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "Checkout" }]}
        title="Your Cart"
        subtitle="One great upgrade. Ready when you are."
      />
      <CartView products={products} />

      <section className="mt-14">
        <SectionHeading title="Complete your setup" />
        <ProductGrid products={products.filter((p) => p.featured).slice(0, 4)} />
      </section>
    </div>
  );
}
