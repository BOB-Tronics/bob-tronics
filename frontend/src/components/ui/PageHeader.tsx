import Breadcrumb, { type Crumb } from "./Breadcrumb";

// Breadcrumb + big title + subtitle, used at the top of most inner pages.
export default function PageHeader({
  crumbs,
  title,
  subtitle,
}: {
  crumbs: Crumb[];
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="space-y-2 py-8 sm:py-10">
      <Breadcrumb items={crumbs} />
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
      {subtitle && <p className="text-base text-muted sm:text-lg">{subtitle}</p>}
    </div>
  );
}
