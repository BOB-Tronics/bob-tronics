import ServiceRequestForm from "@/components/services/ServiceRequestForm";
import PageHeader from "@/components/ui/PageHeader";
import { getItServices } from "@/services/account";

export const metadata = { title: "Request IT Service · BOB TRONICS" };
export const dynamic = "force-dynamic";

export default async function ItServiceRequestPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const [services, params] = await Promise.all([getItServices(), searchParams]);
  const serviceNames = [...services.map((service) => service.name), "Device Setup", "Security & Backup", "Business IT Care"];

  return (
    <div className="auth-background">
      <div className="page-container pb-12">
        <PageHeader
          crumbs={[{ label: "IT Services", href: "/it-services" }, { label: "Request" }]}
          title="Request IT Service"
          subtitle="Tell us what you need. We’ll take care of the next step."
        />
        <ServiceRequestForm services={serviceNames} initialService={params.service} />
      </div>
    </div>
  );
}
