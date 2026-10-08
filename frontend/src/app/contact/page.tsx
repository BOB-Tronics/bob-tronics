import ServiceRequestForm from "@/components/services/ServiceRequestForm";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";

export const metadata = { title: "Contact · BOB TRONICS" };

export default function ContactPage() {
  return (
    <div className="page-container pb-12">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        title="We’re here to help."
        subtitle="Questions about an order, a device or our services? Send us a message."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-start">
        <Card>
          <h2 className="text-xl font-bold text-ink">Visit or call</h2>
          <dl className="mt-4 space-y-4 text-ink">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Store</dt>
              <dd className="mt-1">KG 7 Avenue, Kimihurura, Kigali</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Phone</dt>
              <dd className="mt-1">+250 78 000 0000 (example)</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Hours</dt>
              <dd className="mt-1">Mon–Sat · 08:00–19:00</dd>
            </div>
          </dl>
          <p className="mt-6 text-xs text-muted">Illustrative demo store · Contact details are examples.</p>
        </Card>
        <ServiceRequestForm submitLabel="Send message" />
      </div>
    </div>
  );
}
