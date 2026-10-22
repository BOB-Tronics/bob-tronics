import ServiceRequestForm from "@/components/services/ServiceRequestForm";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";

export const metadata = { title: "Contact · BOB TRONICS" };

const questions = [
  ["How do I track my order?", "Use Track Order with your order number, or sign in to view the full timeline."],
  ["Are your products genuine?", "Our store experience is designed around verified stock and clear warranty information."],
  ["Can you provide on-site IT support?", "Choose an on-site appointment in the IT service request flow."],
  ["Which payment methods are available?", "Mobile Money and Card are available at checkout."],
];

function DemoMap() {
  return <div className="demo-map relative h-72 overflow-hidden rounded-xl bg-[#e5e5e5] sm:h-80" aria-label="Illustrative Kigali map">
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 360" preserveAspectRatio="none" role="img" aria-label="Static map illustration">
      <rect width="1000" height="360" fill="#e7e7e7" />
      <path d="M0 336 160 315 295 330 430 295 570 310 710 270 830 278 1000 240v120H0Z" fill="#83abc3" />
      <g fill="#c4e6d5"><path d="M50 50h125v66H50zM250 20h95v72h-95zM650 40h120v65H650zM810 150h110v60H810zM125 190h100v70H125zM420 55h85v70h-85z" /></g>
      <g fill="none" stroke="#fff" strokeWidth="8"><path d="M-20 90 190 150 370 80 540 135 730 90 1030 155M-20 235 190 180 370 250 530 185 730 230 1020 180M150-20 200 380M360-20 400 380M580-20 600 380M800-20 760 380M-20 300 1020 30" /></g>
      <g fill="none" stroke="#d0d0d0" strokeWidth="3"><path d="m0 45 1000 260M0 150 1000 20M60 0l20 300M280 0l-30 300M480 0l20 300M680 0l-20 300M900 0l-50 300" /></g>
      <path d="M110 220h130v-70h110V95h130" fill="none" stroke="#080b91" strokeWidth="6" />
      <circle cx="480" cy="95" r="19" fill="#080b91" /><circle cx="480" cy="95" r="7" fill="white" />
    </svg>
    <span className="absolute bottom-4 left-4 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-ink shadow">Kigali, Rwanda · Static demo map</span>
  </div>;
}

export default function ContactPage() {
  return (
    <div className="auth-background">
      <div className="page-container pb-12">
        <PageHeader crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]} title="Let’s talk technology." subtitle="Questions about a product, your order or an IT challenge? We’re here to help." />
        <div className="rounded-lg bg-accent p-4 text-sm"><p className="font-semibold text-primary">Illustrative demo contact information</p><p className="mt-1 text-muted">The address, phone, email and opening hours below are examples—not verified business details.</p></div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.6fr] lg:items-start">
          <div className="space-y-5">
            <Card><h2 className="text-xl font-bold">Contact our team</h2><dl className="mt-5 space-y-4 text-sm"><div><dt className="font-semibold">Demo showroom</dt><dd className="mt-2 text-ink/80">Kigali, Rwanda</dd></div><div><dt className="font-semibold">Call us</dt><dd className="mt-2 text-primary">+250 78 555 0100</dd></div><div><dt className="font-semibold">Email us</dt><dd className="mt-2 text-primary">hello@bobtronics.example</dd></div><div><dt className="font-semibold">Opening hours</dt><dd className="mt-2 leading-7 text-ink/80">Mon–Sat · 9:00 AM–6:00 PM<br /><span className="text-muted">Sunday · Closed</span></dd></div></dl></Card>
            <Card><h2 className="text-xl font-bold">Stay connected</h2><p className="mt-4 text-sm text-primary">Instagram ↗ · Facebook ↗</p><p className="mt-4 text-xs text-muted">Social links are illustrative demo destinations.</p></Card>
          </div>
          <ServiceRequestForm contactMode submitLabel="Send message →" />
        </div>
        <Card className="mt-6"><h2 className="mb-5 text-xl font-bold">Find us</h2><DemoMap /><a href="https://maps.google.com/?q=Kigali+Rwanda" className="mt-4 inline-flex rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-primary hover:bg-surface">Get directions ↗</a></Card>
        <Card className="mt-6"><h2 className="text-xl font-bold">Frequently Asked Questions</h2><div className="mt-5 space-y-4">{questions.map(([question, answer]) => <div key={question}><h3 className="text-sm font-bold">{question}</h3><p className="mt-1 text-sm text-muted">{answer}</p></div>)}</div></Card>
      </div>
    </div>
  );
}
