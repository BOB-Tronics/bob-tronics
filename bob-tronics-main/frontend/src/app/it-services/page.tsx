import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  HeadsetIcon,
  LaptopIcon,
  NetworkIcon,
  RouterIcon,
  ShieldIcon,
  WrenchIcon,
} from "@/components/ui/Icons";
import Card from "@/components/ui/Card";
import { getItServices } from "@/services/account";

export const metadata = { title: "IT Services · BOB TRONICS" };
export const dynamic = "force-dynamic";

const extraServices = [
  {
    name: "Device Setup",
    description: "Get your new technology ready from day one.",
    detail: "Migration · Configuration · Training",
    icon: LaptopIcon,
  },
  {
    name: "Security & Backup",
    description: "Protect the data your business depends on.",
    detail: "Endpoint security · Cloud backup · Recovery",
    icon: ShieldIcon,
  },
  {
    name: "Business IT Care",
    description: "Proactive support without the operational burden.",
    detail: "Managed services · Monitoring · Helpdesk",
    icon: WrenchIcon,
  },
];

export default async function ItServicesPage() {
  const services = await getItServices();
  const serviceIcons = [NetworkIcon, HeadsetIcon, RouterIcon];
  const listedServices = [
    ...services.map((service, index) => ({
      ...service,
      detail:
        index === 0
          ? "Technology audits · Procurement · Strategy"
          : index === 1
            ? "Device issues · Software · Maintenance"
            : "Wi-Fi · Routers · Office networks",
      Icon: serviceIcons[index] ?? WrenchIcon,
    })),
    ...extraServices.map((service) => ({ ...service, Icon: service.icon })),
  ];

  return (
    <div className="auth-background">
      <div className="page-container pb-12">
        <section className="pt-8 sm:pt-10">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Expert help, built around you.
          </h1>
          <p className="mt-1 text-muted">
            Choose the service that fits your needs.
          </p>
        </section>
        <section className="mt-1 grid min-h-[430px] overflow-hidden bg-navy text-white md:grid-cols-[0.46fr_1fr]">
          <div className="z-10 flex flex-col items-start justify-center p-7 sm:p-10">
            <h2 className="text-4xl font-bold leading-tight sm:text-5xl">
              Technology Solutions Beyond the Store.
            </h2>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-white/85">
              From your first device to your entire business network, our
              specialists turn technology challenges into forward momentum.
            </p>
            <Link
              href="/it-services/request"
              className="mt-10 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Request IT Service <ArrowRightIcon size={16} />
            </Link>
          </div>
          <div className="relative w-full min-h-72 overflow-hidden bg-slate-800">
            <Image
              src="/images/it-services/max.gif"
              alt="Technology specialist providing IT support"
              fill
              unoptimized
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover"
            />
          </div>
        </section>
        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listedServices.map(({ name, description, detail, Icon }) => (
            <Card key={name} className="flex min-h-64 flex-col items-start">
              <Icon size={28} className="text-primary" />
              <h3 className="mt-5 text-xl font-bold">{name}</h3>
              <p className="mt-3 text-sm text-muted">{description}</p>
              <p className="mt-4 text-xs text-muted">{detail}</p>
              <Link
                href={`/it-services/request?service=${encodeURIComponent(name)}`}
                className="mt-auto inline-flex items-center gap-1 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-primary hover:bg-surface"
              >
                Choose service <ArrowRightIcon size={16} />
              </Link>
            </Card>
          ))}
        </section>
        <Card className="mt-7">
          <h2 className="text-lg font-bold">
            A clear path from request to resolution
          </h2>
          <p className="mt-4 text-sm">
            01 Choose Service → 02 Describe Need → 03 Choose Date → 04 Submit →
            05 Confirmation
          </p>
          <p className="mt-4 text-sm text-muted">
            Tell us what you need. We confirm the scope, appointment and any
            costs before work begins.
          </p>
        </Card>
        <div className="mt-6 rounded-lg bg-accent p-4 text-sm">
          <p className="font-semibold text-primary">
            On-site or remote. Always human.
          </p>
          <p className="mt-1 text-xs text-muted">
            Demo service area: Accra &amp; Greater Accra · Mon–Sat, 9AM–6PM ·
            Request a tailored quote.
          </p>
        </div>
      </div>
    </div>
  );
}
