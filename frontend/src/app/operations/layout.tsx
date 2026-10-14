import type { ReactNode } from "react";
import OperationsFrame from "@/components/operations/OperationsFrame";

export default function OperationsLayout({ children }: { children: ReactNode }) {
  return <OperationsFrame>{children}</OperationsFrame>;
}
