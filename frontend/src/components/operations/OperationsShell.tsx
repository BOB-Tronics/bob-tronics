import type { ReactNode } from "react";
export default function OperationsShell({ children }: {
  active?: string;
  children?: ReactNode;
  hideHeader?: boolean;
}) {
  return <>{children}</>;
}

