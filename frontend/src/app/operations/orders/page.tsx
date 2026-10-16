"use client";
import Link from "next/link";

import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";

type OperationsOrder = {
  id: string;
  customer: string;
  placed: string;
  total: number;
  payment: string;
  delivery: string;
};

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

const orders: OperationsOrder[] = [
  { id: "BT-10482", customer: "David Shema", placed: "01 Oct 2026", total: 14080, payment: "Paid", delivery: "Packed" },
  { id: "BT-10481", customer: "Kofi Asante", placed: "01 Oct 2026", total: 7280, payment: "Paid", delivery: "Processing" },
  { id: "BT-10480", customer: "Esi Boateng", placed: "01 Oct 2026", total: 12880, payment: "Pending", delivery: "Confirmed" },
  { id: "BT-10479", customer: "Kwame Owusu", placed: "30 Sep 2026", total: 3880, payment: "Paid", delivery: "Delivered" },
  { id: "BT-10478", customer: "Nana Adjei", placed: "30 Sep 2026", total: 16980, payment: "Paid", delivery: "Out for Delivery" },
  { id: "BT-10477", customer: "Akua Osei", placed: "29 Sep 2026", total: 13280, payment: "Paid", delivery: "Delivered" },
  { id: "BT-10476", customer: "Yaw Sarpong", placed: "29 Sep 2026", total: 7280, payment: "Failed", delivery: "On hold" },
  { id: "BT-10475", customer: "Abena Darko", placed: "28 Sep 2026", total: 3880, payment: "Paid", delivery: "Delivered" },
];

const tabs = ["All orders", "Awaiting payment", "Processing", "Packed", "Delivered"];

function matchesTab(order: OperationsOrder, tab: string) {
  if (tab === "Awaiting payment") return order.payment === "Pending";
  if (tab === "Processing") return order.delivery === "Processing";
  if (tab === "Packed") return order.delivery === "Packed";
  if (tab === "Delivered") return order.delivery === "Delivered";
  return true;
}

export default function OperationsOrdersPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [statusFilter, setStatusFilter] = useState("all");

  const visibleOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "all" ||
        order.payment === statusFilter ||
        order.delivery === statusFilter;
      return matchesSearch && matchesStatus && matchesTab(order, activeTab);
    });
  }, [search, statusFilter, activeTab]);

  return (
    <div className="operations-dashboard min-h-screen bg-[#e9edff] text-slate-900 lg:flex">
      <style>{`body:has(.operations-dashboard) > header, body:has(.operations-dashboard) > footer { display: none; }`}</style>
      <aside className="flex shrink-0 flex-col bg-[#080e29] px-5 py-5 text-white lg:sticky lg:top-0 lg:h-screen lg:w-[220px]">
        <Link href="/operations/dashboard" className="mb-7 text-xl font-extrabold tracking-tight">BOB TRONICS</Link>
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Operations workspace</p>
        <nav aria-label="Operations" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto pb-2 lg:mx-0 lg:flex-col lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain">
          {navigation.map(([icon, label, href]) => {
            const active = label === "Orders";
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
            <p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Orders</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Orders</h1>
            <p className="mt-2 text-sm text-slate-500">Every purchase, from payment to delivery.</p>

            <div className="mt-6 flex flex-wrap items-end gap-3">
              <label className="min-w-[240px] flex-1 text-xs font-semibold text-slate-800">
                Search orders
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Enter order number or customer" className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none placeholder:text-slate-400 focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100" />
              </label>
              <label className="sr-only" htmlFor="orders-status">Order filter</label>
              <select id="orders-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900">
                <option value="all">Filters · All statuses</option>
                <option value="Pending">Payment pending</option>
                <option value="Failed">Payment failed</option>
                <option value="Processing">Processing</option>
                <option value="Packed">Packed</option>
                <option value="Delivered">Delivered</option>
              </select>
              <button type="button" className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900 hover:bg-indigo-50">Export</button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <article className="rounded-2xl border border-white/70 bg-white p-5 shadow-[0_8px_28px_rgba(29,45,99,.07)]"><p className="text-[28px] font-extrabold">142</p><p className="mt-3 text-xs text-slate-500">This month</p></article>
              <article className="rounded-2xl border border-white/70 bg-white p-5 shadow-[0_8px_28px_rgba(29,45,99,.07)]"><p className="text-[28px] font-extrabold">12</p><p className="mt-3 text-xs text-slate-500">Processing</p></article>
              <article className="rounded-2xl border border-white/70 bg-white p-5 shadow-[0_8px_28px_rgba(29,45,99,.07)]"><p className="text-[28px] font-extrabold">6</p><p className="mt-3 text-xs text-slate-500">Ready to dispatch</p></article>
            </div>

            <div role="tablist" aria-label="Order status" className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
              {tabs.map((tab) => {
                const selected = activeTab === tab;
                return <button key={tab} role="tab" aria-selected={selected} onClick={() => setActiveTab(tab)} className={`shrink-0 rounded-lg border px-3.5 py-2.5 text-xs font-semibold ${selected ? "border-[#10139a] bg-[#efefff] text-indigo-900" : "border-transparent bg-white text-slate-500 hover:bg-indigo-50"}`}>{tab}</button>;
              })}
            </div>

            <section className="mt-5 rounded-2xl border border-white/70 bg-white p-5 shadow-[0_8px_28px_rgba(29,45,99,.07)] sm:p-6">
              <h2 className="mb-5 text-lg font-bold tracking-tight text-slate-800">Order management</h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[800px] text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] text-slate-500">
                    <tr>{["Order", "Customer", "Placed", "Total", "Payment / Delivery", "Actions"].map((heading) => <th key={heading} className="px-3 py-3.5 font-semibold">{heading}</th>)}</tr>
                  </thead>
                  <tbody>
                    {visibleOrders.map((order) => (
                      <tr key={order.id} className="border-t border-slate-200">
                        <th scope="row" className="whitespace-nowrap px-3 py-4 font-semibold text-slate-900">{order.id}</th>
                        <td className="px-3 py-4">{order.customer}</td>
                        <td className="whitespace-nowrap px-3 py-4">{order.placed}</td>
                        <td className="whitespace-nowrap px-3 py-4">{formatPrice(order.total)}</td>
                        <td className="whitespace-nowrap px-3 py-4">{order.payment} · {order.delivery}</td>
                        <td className="px-3 py-4"><Link href={`/operations/orders/${order.id}`} className="whitespace-nowrap font-semibold text-indigo-800">Manage →</Link></td>
                      </tr>
                    ))}
                    {visibleOrders.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">No orders match your search and filters.</td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[11px] text-slate-500">1–{visibleOrders.length} of 142 orders</p>
                <button type="button" disabled className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-indigo-900 disabled:cursor-not-allowed">Next page →</button>
              </div>
            </section>

            <div className="mt-5 rounded-lg border border-white/70 bg-[#f0efff] px-4 py-4">
              <p className="text-sm font-bold text-indigo-900">Payment exceptions · 2 orders</p>
              <p className="mt-1 text-xs text-slate-500">Review failed or pending payments before fulfilling orders.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}












