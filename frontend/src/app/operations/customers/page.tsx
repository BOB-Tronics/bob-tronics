"use client";
import Link from "next/link";

import { useMemo, useState } from "react";

type CustomerSegment = "New" | "Returning";

type OperationsCustomer = {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  lastActive: string;
  segment: CustomerSegment;
};

const customers: OperationsCustomer[] = [
  { id: "c1", name: "Ama Mensah", email: "ama@example.com", orders: 3, totalSpent: 30840, lastActive: "01 Oct 2026", segment: "Returning" },
  { id: "c2", name: "Kofi Asante", email: "kofi@example.com", orders: 5, totalSpent: 42180, lastActive: "01 Oct 2026", segment: "Returning" },
  { id: "c3", name: "Esi Boateng", email: "esi@example.com", orders: 2, totalSpent: 18460, lastActive: "01 Oct 2026", segment: "Returning" },
  { id: "c4", name: "Kwame Owusu", email: "kwame@example.com", orders: 4, totalSpent: 22920, lastActive: "30 Sep 2026", segment: "Returning" },
  { id: "c5", name: "Nana Adjei", email: "nana@example.com", orders: 1, totalSpent: 16980, lastActive: "30 Sep 2026", segment: "New" },
  { id: "c6", name: "Akua Osei", email: "akua@example.com", orders: 2, totalSpent: 20560, lastActive: "30 Sep 2026", segment: "New" },
];

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

const tabs = [
  { label: "All customers", count: 89, segment: "All" },
  { label: "New this month", count: 12, segment: "New" },
  { label: "Returning", count: 77, segment: "Returning" },
];

export default function OperationsCustomersPage() {
  const [search, setSearch] = useState("");
  const [activeSegment, setActiveSegment] = useState("All");
  const [activityFilter, setActivityFilter] = useState("all");

  const visibleCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return customers.filter((customer) => {
      const matchesSearch =
        !query ||
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query);
      const matchesSegment = activeSegment === "All" || customer.segment === activeSegment;
      const matchesActivity =
        activityFilter === "all" ||
        (activityFilter === "repeat" ? customer.orders >= 3 : customer.lastActive === "01 Oct 2026");
      return matchesSearch && matchesSegment && matchesActivity;
    });
  }, [search, activeSegment, activityFilter]);

  return (
    <div className="operations-dashboard min-h-screen bg-[#e9edff] text-slate-900 lg:flex">
      <style>{`body:has(.operations-dashboard) > header, body:has(.operations-dashboard) > footer { display: none; }`}</style>
      <aside className="flex shrink-0 flex-col bg-[#080e29] px-5 py-5 text-white lg:sticky lg:top-0 lg:h-screen lg:w-[220px]">
        <Link href="/operations/dashboard" className="mb-7 text-xl font-extrabold tracking-tight">BOB TRONICS</Link>
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Operations workspace</p>
        <nav aria-label="Operations" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto pb-2 lg:mx-0 lg:flex-col lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain">
          {navigation.map(([icon, label, href]) => {
            const active = label === "Customers";
            return (
              <Link key={label} href={href} aria-current={active ? "page" : undefined} className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${active ? "bg-[#1013a6] text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
                <span aria-hidden="true" className="w-4 text-center text-base">{icon}</span>{label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto hidden space-y-6 pt-8 lg:block">
          <div className="rounded-xl bg-[#efefff] p-4 text-[#10139a]">
            <p className="text-sm font-bold">All systems operational</p>
            <p className="mt-1 text-xs text-slate-500">Last sync · 1 minute ago</p>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">Demo workspace · Accra, GH</p>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex h-[70px] items-center justify-between border-b border-slate-100 bg-white px-5 sm:px-8">
          <p className="text-sm font-semibold text-slate-800">Workspace / Dashboard</p>
          <div className="flex items-center gap-4 text-indigo-800"><button aria-label="Notifications" className="text-lg">♧</button><span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-50 text-xs font-bold">EK</span></div>
        </header>

        <main className="min-h-[calc(100vh-70px)] bg-[linear-gradient(135deg,#e0e5fa_0%,#edf0ff_45%,#dfe5fa_100%)] px-4 py-7 sm:px-7 lg:px-8">
          <div className="mx-auto max-w-[1500px]">
            <p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Customers</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Customers</h1>
            <p className="mt-2 text-sm text-slate-500">Understand and support your customer relationships.</p>

            <div className="mt-6 flex flex-wrap items-end gap-3">
              <label className="min-w-[240px] flex-1 text-xs font-semibold text-slate-800">
                Search customers
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Enter keyword" className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none placeholder:text-slate-400 focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100" />
              </label>
              <label className="sr-only" htmlFor="customer-filter">Customer filter</label>
              <select id="customer-filter" value={activityFilter} onChange={(event) => setActivityFilter(event.target.value)} className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900">
                <option value="all">Filters · All activity</option>
                <option value="active">Active on 01 Oct</option>
                <option value="repeat">3+ orders</option>
              </select>
              <button type="button" className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900 hover:bg-indigo-50">Export</button>
            </div>

            <div role="tablist" aria-label="Customer segment" className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
              {tabs.map((tab) => {
                const selected = activeSegment === tab.segment;
                return <button key={tab.segment} role="tab" aria-selected={selected} onClick={() => setActiveSegment(tab.segment)} className={`shrink-0 rounded-lg border px-3.5 py-2.5 text-xs font-semibold ${selected ? "border-[#10139a] bg-[#efefff] text-indigo-900" : "border-transparent bg-white text-slate-500 hover:bg-indigo-50"}`}>{tab.label} ({tab.count})</button>;
              })}
            </div>

            <section className="mt-5 rounded-2xl border border-white/70 bg-white p-5 shadow-[0_8px_28px_rgba(29,45,99,.07)] sm:p-6">
              <h2 className="mb-5 text-lg font-bold tracking-tight text-slate-800">Customer directory</h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[800px] text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] text-slate-500">
                    <tr>{["Customer", "Email", "Orders", "Total spent", "Last active", "Actions"].map((heading) => <th key={heading} className="px-3 py-3.5 font-semibold">{heading}</th>)}</tr>
                  </thead>
                  <tbody>
                    {visibleCustomers.map((customer) => (
                      <tr key={customer.id} className="border-t border-slate-200">
                        <th scope="row" className="whitespace-nowrap px-3 py-4 font-semibold text-slate-900">{customer.name}</th>
                        <td className="px-3 py-4">{customer.email}</td>
                        <td className="px-3 py-4">{customer.orders}</td>
                        <td className="whitespace-nowrap px-3 py-4">RWF {customer.totalSpent.toLocaleString("en-US")}</td>
                        <td className="whitespace-nowrap px-3 py-4">{customer.lastActive}</td>
                        <td className="px-3 py-4"><Link href={`/operations/customers/${customer.id}`} className="whitespace-nowrap font-semibold text-indigo-800">View profile →</Link></td>
                      </tr>
                    ))}
                    {visibleCustomers.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">No customers match your search and filters.</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-5 rounded-2xl border border-white/70 bg-white p-5 shadow-[0_8px_28px_rgba(29,45,99,.07)] sm:p-6">
              <h2 className="text-lg font-bold tracking-tight text-slate-800">Customer segments</h2>
              <p className="mt-5 text-sm text-slate-700">Returning customers · 77 · 86.5% of active customers</p>
              <p className="mt-5 text-sm text-slate-700">New customers · 12 · 13.5% of active customers</p>
              <p className="mt-5 text-xs text-slate-500">Customer data shown is illustrative demo information.</p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}









