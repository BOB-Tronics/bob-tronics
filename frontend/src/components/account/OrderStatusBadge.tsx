import Badge from "@/components/ui/Badge";
import type { OrderStatus } from "@/types";

const tones: Record<OrderStatus, "accent" | "success" | "warning" | "neutral"> = {
  Processing: "accent",
  Packed: "accent",
  "Out for delivery": "warning",
  Delivered: "success",
  Cancelled: "neutral",
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={tones[status]}>{status}</Badge>;
}
