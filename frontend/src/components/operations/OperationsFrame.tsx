"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navigation = [
  ["▦", "Dashboard", "/operations/dashboard"],
  ["⬡", "Products", "/operations/products"],
  ["▦", "Categories", "/operations/categories"],
  ["♧", "Inventory", "/operations/inventory"],
  ["▣", "Orders", "/operations/orders"],
  ["♙", "Customers", "/operations/customers"],
  ["▤", "Payments", "/operations/payments"],
  ["▱", "Deliveries", "/operations/deliveries"],
  ["⚒", "IT Requests", "/operations/it-requests"],
  ["☆", "Reviews", "/operations/reviews"],
  ["♧", "Notifications", "/operations/notifications"],
  ["⌁", "Reports", "/operations/reports"],
  ["⚙", "Settings", "/operations/settings"],
];
const legacyShellRoutes = ["/operations/dashboard", "/operations/products", "/operations/categories", "/operations/inventory", "/operations/orders", "/operations/customers", "/operations/payments"];

export default function OperationsFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const pageHasItsOwnMain = legacyShellRoutes.includes(pathname);
  const activeRoute = pathname.startsWith("/operations/products/") ? "/operations/products" : pathname;

  return <div className="operations-frame min-h-screen bg-[#e9edff] text-slate-900 lg:flex">
    <style>{`body:has(.operations-frame) > header, body:has(.operations-frame) > footer { display: none; } .operations-page-content > .operations-dashboard > aside, .operations-page-content > .operations-dashboard > div > header { display: none !important; }`}</style>
    <aside className="flex shrink-0 flex-col bg-[#080e29] px-5 py-5 text-white lg:sticky lg:top-0 lg:h-screen lg:w-[220px]">
      <Link href="/operations/dashboard" className="mb-7 text-xl font-extrabold tracking-tight">BOB TRONICS</Link>
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Operations workspace</p>
      <nav aria-label="Operations" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto pb-2 lg:mx-0 lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-y-auto lg:overscroll-contain">
        {navigation.map(([icon, label, href]) => {
          const selected = href === activeRoute;
          return <Link key={href} href={href} aria-current={selected ? "page" : undefined} className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${selected ? "bg-[#1013a6] text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><span aria-hidden="true" className="w-4 text-center text-base">{icon}</span>{label}</Link>;
        })}
      </nav>
      <div className="mt-auto hidden space-y-6 pt-8 lg:block"><div className="rounded-xl bg-[#efefff] p-4 text-[#10139a]"><p className="text-sm font-bold">All systems operational</p><p className="mt-1 text-xs text-slate-500">Last sync · 1 minute ago</p></div><p className="text-[11px] leading-relaxed text-slate-500">Demo workspace · Accra, GH</p></div>
    </aside>
    <div className="min-w-0 flex-1">
      <header className="flex h-[70px] items-center justify-between border-b border-slate-100 bg-white px-5 sm:px-8"><p className="text-sm font-semibold text-slate-800">Workspace / Dashboard</p><div className="flex items-center gap-4 text-indigo-800"><button aria-label="Notifications" className="text-lg">♧</button><span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-50 text-xs font-bold">EK</span></div></header>
      {pageHasItsOwnMain ? <div className="operations-page-content min-h-[calc(100vh-70px)]">{children}</div> : <main className="operations-page-content min-h-[calc(100vh-70px)] bg-[linear-gradient(135deg,#e0e5fa_0%,#edf0ff_45%,#dfe5fa_100%)] px-4 py-7 sm:px-7 lg:px-8"><div className="mx-auto max-w-[1500px]">{children}</div></main>}
    </div>
  </div>;
}

