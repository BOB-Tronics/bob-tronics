"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AccountSidebar from "@/components/account/AccountSidebar";
import PageHeader from "@/components/ui/PageHeader";
import type { User } from "@/types";

const sectionTitles: Record<string, string> = {
  orders: "Orders",
  wishlist: "Wishlist",
  addresses: "Addresses",
  payments: "Payments",
  profile: "Profile",
  notifications: "Notifications",
  support: "Support",
};

export default function AccountLayoutFrame({ user, children }: { user: User; children: ReactNode }) {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const title = parts.length === 1
    ? `Welcome back, ${user.firstName}.`
    : parts[1] === "orders" && parts[2]
      ? `Order ${parts[2]}`
      : sectionTitles[parts[1]] ?? "My account";

  return <div className="page-container pb-12">
    <PageHeader crumbs={[{ label: "Home", href: "/" }, { label: "My account", href: "/account" }]} title={title} subtitle="Your technology, orders and support in one place." />
    <div className="grid min-w-0 gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
      <AccountSidebar user={user} />
      <div className="min-w-0 space-y-6">{children}</div>
    </div>
  </div>;
}
