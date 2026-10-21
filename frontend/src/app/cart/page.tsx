import CartPageContent from "@/components/cart/CartPageContent";
import PageHeader from "@/components/ui/PageHeader";

export const metadata = { title: "Your Cart · BOB TRONICS" };

export default function CartPage() {
  return (
    <div className="page-container pb-12">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "Checkout" }]}
        title="Your Cart"
        subtitle="One great upgrade. Ready when you are."
      />
      <CartPageContent />
    </div>
  );
}
