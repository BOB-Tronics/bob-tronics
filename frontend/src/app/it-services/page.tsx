import ServiceCards from "@/components/home/ServicesSection";
import ServiceRequestForm from "@/components/services/ServiceRequestForm";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import { getItServices } from "@/services/account";

export const metadata = { title: "IT Services · BOB TRONICS" };

export default async function ItServicesPage() {
  const services = await getItServices();

  return (
    <div className="page-container pb-12">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "IT Services" }]}
        title="More than devices. Real solutions."
        subtitle="IT Services that keep you connected and moving."
      />
      <ServiceCards services={services} />

      <section className="mt-14">
        <SectionHeading title="Request a service" subtitle="Tell us what you need and we will get back to you within one business day." size="md" />
        <ServiceRequestForm services={services.map((s) => s.name)} />
      </section>
    </div>
  );
}
