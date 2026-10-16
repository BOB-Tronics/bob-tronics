import Link from "next/link";
import type { ItService } from "@/types";
import Card from "@/components/ui/Card";
import { ArrowRightIcon, HeadsetIcon, NetworkIcon, RouterIcon, WrenchIcon } from "@/components/ui/Icons";

const icons = {
  consulting: NetworkIcon,
  support: HeadsetIcon,
  network: RouterIcon,
  repair: WrenchIcon,
};

export default function ServiceCards({ services }: { services: ItService[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {services.map((service) => {
        const Icon = icons[service.icon];
        return (
          <Card key={service.id}>
            <Icon size={32} className="text-primary" />
            <h3 className="mt-5 text-xl font-semibold text-ink">{service.name}</h3>
            <p className="mt-3 text-muted">{service.description}</p>
            <Link
              href={`/it-services/request?service=${encodeURIComponent(service.name)}`}
              className="mt-5 inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              Choose service <ArrowRightIcon size={16} />
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
