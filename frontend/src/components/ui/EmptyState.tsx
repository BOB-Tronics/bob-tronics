import type { ReactNode } from "react";
import Card from "./Card";

export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <Card className="text-center">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="mt-2 text-muted">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </Card>
  );
}
