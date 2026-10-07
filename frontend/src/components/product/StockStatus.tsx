import type { StockStatus as Status } from "@/types";

const labels: Record<Status, { text: string; className: string }> = {
  "in-stock": { text: "In stock · Verified stock", className: "text-success" },
  "low-stock": { text: "Low stock · Verified stock", className: "text-warning" },
  "pre-order": { text: "Pre-order · Ships soon", className: "text-muted" },
};

// Coloured dot + label. The text carries the meaning, the colour only reinforces it.
export default function StockStatus({ status, className = "" }: { status: Status; className?: string }) {
  const { text, className: tone } = labels[status];
  return (
    <p className={`flex items-center gap-1.5 text-xs font-medium ${tone} ${className}`}>
      <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
      {text}
    </p>
  );
}
