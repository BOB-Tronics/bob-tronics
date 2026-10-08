import WhySection from "@/components/home/WhySection";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata = { title: "About · BOB TRONICS" };

export default function AboutPage() {
  return (
    <div className="page-container pb-12">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        title="A Technology Hub built on trust."
        subtitle="Genuine tech. Expert support. Delivered."
      />
      <Card>
        <p className="text-lg text-ink/80">
          BOB TRONICS brings verified devices from Apple, Samsung, Dell, Sony and HP to Kigali, backed by
          specialists who help you choose, set up and keep your technology running. Every product is sealed,
          authorized stock with clear warranty coverage.
        </p>
      </Card>
      <section className="mt-14">
        <SectionHeading title="Why BOB TRONICS" subtitle="Carefully chosen technology. Confidence at every step." />
        <WhySection />
      </section>
    </div>
  );
}
