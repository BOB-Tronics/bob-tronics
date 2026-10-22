import { BadgeCheckIcon, HeadsetIcon, LockIcon, ShieldIcon, TruckIcon } from "@/components/ui/Icons";

const items = [
  { icon: ShieldIcon, label: "Quality Products" },
  { icon: BadgeCheckIcon, label: "Verified Stock" },
  { icon: LockIcon, label: "Secure Payments" },
  { icon: TruckIcon, label: "Reliable Delivery" },
  { icon: HeadsetIcon, label: "IT Support" },
];

export default function TrustBar() {
  return (
    <section className="bg-navy text-white" aria-label="Why shop with us">
      <ul className="page-container grid grid-cols-2 gap-x-4 gap-y-4 py-5 sm:grid-cols-3 lg:grid-cols-5">
        {items.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3 text-sm font-medium">
            <Icon size={22} className="shrink-0 text-blue-300" />
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}
