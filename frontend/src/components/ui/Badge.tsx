import type { ReactNode } from "react";

type Tone = "accent" | "success" | "warning" | "neutral";

const toneClasses: Record<Tone, string> = {
  accent: "bg-accent text-primary",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  neutral: "bg-surface text-muted",
};

export default function Badge({
  tone = "accent",
  children,
  className = "",
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
