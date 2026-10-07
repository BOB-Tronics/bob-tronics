import { StarIcon } from "./Icons";

// Shows either "★ 4.9 (128 reviews)" or five stars depending on `variant`.
export default function Rating({
  value,
  count,
  variant = "compact",
  className = "",
}: {
  value: number;
  count?: number;
  variant?: "compact" | "stars";
  className?: string;
}) {
  if (variant === "stars") {
    return (
      <span className={`inline-flex items-center gap-0.5 text-star ${className}`} aria-label={`${value} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <StarIcon key={n} size={16} className={n <= Math.round(value) ? "" : "opacity-30"} />
        ))}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 text-sm ${className}`}>
      <StarIcon size={14} className="text-star" />
      <span className="font-semibold text-star">{value.toFixed(1)}</span>
      {count !== undefined && <span className="text-muted">({count} reviews)</span>}
    </span>
  );
}
