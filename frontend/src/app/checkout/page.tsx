<<<<<<< HEAD
import CheckoutPage from "../../checkout/checkout";

export default function CheckoutRoute() {
  return <CheckoutPage />;
}
=======
import CheckoutWizard from "@/components/checkout/CheckoutWizard";
import PageHeader from "@/components/ui/PageHeader";
import { getAddresses, getCurrentUser } from "@/services/account";
import { getProducts } from "@/services/products";

export const metadata = { title: "Checkout · BOB TRONICS" };

export default async function CheckoutPage() {
  const [products, user, addresses] = await Promise.all([getProducts(), getCurrentUser(), getAddresses()]);
  const savedAddress = addresses.find((a) => a.isDefault) ?? addresses[0];

  return (
    <div className="page-container pb-12">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "Checkout" }]}
        title="Checkout"
        subtitle="A few simple steps to your next upgrade."
      />
      <CheckoutWizard products={products} user={user} savedAddress={savedAddress} />
    </div>
  );
}
>>>>>>> f3612fbcdda1996521c9fec562a1e23eaf111738
