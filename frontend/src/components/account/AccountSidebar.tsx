"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@/types";

const links = [
  { label: "Overview", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Track Order", href: "/account/orders/BT-10482" },
  { label: "Wishlist", href: "/account/wishlist" },
  { label: "Addresses", href: "/account/addresses" },
  { label: "Payments", href: "/account/payments" },
  { label: "Profile", href: "/account/profile" },
  { label: "Notifications", href: "/account/notifications" },
  { label: "Support", href: "/account/support" },
  { label: "Logout", href: "/" },
];

// Vertical list on desktop; on phones it becomes a horizontal scrollable row
// so the content is not pushed far down the page.
export default function AccountSidebar({ user }: { user: User }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return false;
    if (href === "/account") return pathname === "/account";
    return pathname === href || (href === "/account/orders" && pathname.startsWith("/account/orders") && !pathname.endsWith("BT-10482"));
  }

  return (
    <aside className="min-w-0 overflow-hidden rounded-2xl border border-line/70 bg-white p-4 shadow-card lg:p-6">
      <p className="text-xl font-bold text-ink lg:text-2xl">
        {user.firstName} {user.lastName}
      </p>
      <p className="mt-1 text-sm text-muted">{user.email}</p>

      <nav aria-label="Account" className="mt-4 lg:mt-6">
        <ul className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:px-0">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.label} className="shrink-0">
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium lg:py-3 lg:text-base ${
                    active ? "bg-accent font-semibold text-primary" : "text-muted hover:bg-surface hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
