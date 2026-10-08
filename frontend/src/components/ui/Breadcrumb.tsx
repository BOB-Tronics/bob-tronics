import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

// Two looks: "bold" is the uppercase blue style used on account/cart pages,
// "soft" is the grey style used on product pages.
export default function Breadcrumb({
  items,
  style = "bold",
}: {
  items: Crumb[];
  style?: "bold" | "soft";
}) {
  const textClass =
    style === "bold"
      ? "text-xs font-bold uppercase tracking-wide text-primary"
      : "text-sm text-muted";

  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-1 ${textClass}`}>
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-1">
          {index > 0 && <span aria-hidden="true">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className={style === "soft" ? "text-ink" : ""}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
