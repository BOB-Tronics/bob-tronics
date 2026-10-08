import type { ReactNode } from "react";
import PageHeader from "@/components/ui/PageHeader";
import AccountSidebar from "./AccountSidebar";
import { getCurrentUser } from "@/services/account";

// Shared frame for every "My account" page: breadcrumb, title, sidebar, content.
export default async function AccountShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="page-container pb-12">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "My account", href: "/account" }]}
        title={title}
        subtitle="Your technology, orders and support in one place."
      />
      <div className="grid min-w-0 gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
        <AccountSidebar user={user} />
        <div className="min-w-0 space-y-6">{children}</div>
      </div>
    </div>
  );
}
