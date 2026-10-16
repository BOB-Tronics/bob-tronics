import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication · BOB TRONICS",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
