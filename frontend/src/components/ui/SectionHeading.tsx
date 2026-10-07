import type { ReactNode } from "react";

// Title + subtitle row with an optional action (button/link) on the right.
export default function SectionHeading({
  title,
  subtitle,
  action,
  size = "lg",
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  size?: "lg" | "md";
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2
          className={`font-bold tracking-tight text-ink ${
            size === "lg" ? "text-2xl sm:text-3xl" : "text-xl"
          }`}
        >
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
