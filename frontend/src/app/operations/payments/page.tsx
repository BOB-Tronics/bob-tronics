"use client";
import Link from "next/link";

import { useMemo, useState } from "react";

type Payment = {
  reference: string;
  order: string;
  customer: string;
  method: string;
  amount: number;
  status: "Paid" | "Pending" | "Failed" | "Refunded";
};

const payments: Payment[] = [
  { reference: "MM-882140", order: "BT-10482", customer: "David Shema", method: "MTN MoMo", amount: 14080, status: "Paid" },
  { reference: "CD-882139", order: "BT-10481", customer: "Kofi Asante", method: "Visa •• 4242", amount: 7280, status: "Paid" },
  { reference: "MM-882138", order: "BT-10480", customer: "Esi Boateng", method: "MTN MoMo", amount: 12880, status: "Pending" },
  { reference: "MM-882137", order: "BT-10479", customer: "Kwame Owusu", method: "Telecel Cash", amount: 3880, status: "Paid" },
  { reference: "CD-882134", order: "BT-10476", customer: "Yaw Sarpong", method: "Mastercard", amount: 7280, status: "Failed" },
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

const tabs = ["All transactions", "Successful", "Pending", "Failed", "Refunded"];

function paymentMatchesTab(payment: Payment, tab: string) {
  if (tab === "Successful") return payment.status === "Paid";
  if (tab === "All transactions") return true;
  return payment.status === tab;
}

function downloadReconciliation() {
  const rows = [
    ["Reference", "Order", "Customer", "Method", "Amount", "Status"],
    ...payments.map((payment) => [
      payment.reference,
      payment.order,
      payment.customer,
      payment.method,
      `GHC ${payment.amount}`,
      payment.status,
    ]),
  ];
  const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n");
  const file = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "bob-tronics-reconciliation.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function OperationsPaymentsPage() {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const visiblePayments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return payments.filter((payment) => {
      const matchesSearch =
        !query ||
        payment.reference.toLowerCase().includes(query) ||
        payment.order.toLowerCase().includes(query) ||
        payment.customer.toLowerCase().includes(query);
      const matchesMethod = methodFilter === "all" || payment.method.includes(methodFilter);
      return matchesSearch && matchesMethod && paymentMatchesTab(payment, activeTab);
    });
  }, [search, methodFilter, activeTab]);

  return (
    <div className="operations-dashboard min-h-screen bg-[#e9edff] text-slate-900 lg:flex">
      <style>{`body:has(.operations-dashboard) > header, body:has(.operations-dashboard) > footer { display: none; }`}</style>
      <aside className="flex shrink-0 flex-col bg-[#080e29] px-5 py-5 text-white lg:sticky lg:top-0 lg:h-screen lg:w-[220px]">
        <Link href="/operations/dashboard" className="mb-7 text-xl font-extrabold tracking-tight">BOB TRONICS</Link>
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Operations workspace</p>
        <nav aria-label="Operations" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto pb-2 lg:mx-0 lg:flex-col lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain">
          {navigation.map(([icon, label, href]) => {
            const active = label === "Payments";
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
            <p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Payments</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Payments</h1>
            <p className="mt-2 text-sm text-slate-500">Track transactions, settlements and payment exceptions.</p>

            <div className="mt-6 flex flex-wrap items-end gap-3">
              <label className="min-w-[240px] flex-1 text-xs font-semibold text-slate-800">
                Search payments
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Enter keyword" className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none placeholder:text-slate-400 focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100" />
              </label>
              <label className="sr-only" htmlFor="payment-method">Payment method filter</label>
              <select id="payment-method" value={methodFilter} onChange={(event) => setMethodFilter(event.target.value)} className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900">
                <option value="all">Filters · All methods</option>
                <option value="MTN">MTN MoMo</option>
                <option value="Visa">Visa</option>
                <option value="Telecel">Telecel Cash</option>
                <option value="Mastercard">Mastercard</option>
              </select>
              <button type="button" onClick={downloadReconciliation} className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900 hover:bg-indigo-50">Export</button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <article className="rounded-2xl border border-white/70 bg-white p-5 shadow-[0_8px_28px_rgba(29,45,99,.07)]"><p className="text-[26px] font-extrabold sm:text-[28px]">RWF 248,600</p><p className="mt-3 text-xs text-slate-500">Collected</p></article>
              <article className="rounded-2xl border border-white/70 bg-white p-5 shadow-[0_8px_28px_rgba(29,45,99,.07)]"><p className="text-[26px] font-extrabold sm:text-[28px]">RWF 12,880</p><p className="mt-3 text-xs text-slate-500">Pending</p></article>
              <article className="rounded-2xl border border-white/70 bg-white p-5 shadow-[0_8px_28px_rgba(29,45,99,.07)]"><p className="text-[28px] font-extrabold">2</p><p className="mt-3 text-xs text-slate-500">Failed payments</p></article>
            </div>

            <div role="tablist" aria-label="Transaction status" className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
              {tabs.map((tab) => {
                const selected = activeTab === tab;
                return <button key={tab} role="tab" aria-selected={selected} onClick={() => setActiveTab(tab)} className={`shrink-0 rounded-lg border px-3.5 py-2.5 text-xs font-semibold ${selected ? "border-[#10139a] bg-[#efefff] text-indigo-900" : "border-transparent bg-white text-slate-500 hover:bg-indigo-50"}`}>{tab}</button>;
              })}
            </div>

            <section className="mt-5 rounded-2xl border border-white/70 bg-white p-5 shadow-[0_8px_28px_rgba(29,45,99,.07)] sm:p-6">
              <h2 className="mb-5 text-lg font-bold tracking-tight text-slate-800">Transaction ledger</h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[760px] text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] text-slate-500">
                    <tr>{["Reference", "Order / Customer", "Method", "Amount", "Status", "Actions"].map((heading) => <th key={heading} className="px-3 py-3.5 font-semibold">{heading}</th>)}</tr>
                  </thead>
                  <tbody>
                    {visiblePayments.map((payment) => (
                      <tr key={payment.reference} className="border-t border-slate-200">
                        <th scope="row" className="whitespace-nowrap px-3 py-4 font-semibold text-slate-900">{payment.reference}</th>
                        <td className="whitespace-nowrap px-3 py-4">{payment.order} / {payment.customer}</td>
                        <td className="whitespace-nowrap px-3 py-4">{payment.method}</td>
                        <td className="whitespace-nowrap px-3 py-4">GH₵ {payment.amount.toLocaleString("en-US")}</td>
                        <td className="px-3 py-4">{payment.status}</td>
                        <td className="px-3 py-4">
                          <button type="button" onClick={() => setSelectedPayment(payment)} className="whitespace-nowrap font-semibold text-indigo-800">
                            {payment.status === "Pending" ? "Check payment" : payment.status === "Failed" ? "Review failure" : "View receipt"}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {visiblePayments.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">No transactions match your search and filters.</td></tr>}
                  </tbody>
                </table>
              </div>
              {selectedPayment && <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-bold text-slate-900">{selectedPayment.status === "Paid" ? "Payment receipt" : `${selectedPayment.status} payment`} · {selectedPayment.reference}</h3>
                  <button type="button" onClick={() => setSelectedPayment(null)} className="text-xs font-semibold text-indigo-800">Close</button>
                </div>
                <p className="mt-2 text-sm text-slate-700">{selectedPayment.order} · {selectedPayment.customer} · GH₵ {selectedPayment.amount.toLocaleString("en-US")}</p>
                <p className="mt-1 text-xs text-slate-500">{selectedPayment.method} · {selectedPayment.status}</p>
              </div>}
            </section>

            <section className="mt-5 rounded-2xl border border-white/70 bg-white p-5 shadow-[0_8px_28px_rgba(29,45,99,.07)] sm:p-6">
              <h2 className="text-lg font-bold tracking-tight text-slate-800">Settlement summary</h2>
              <p className="mt-5 text-sm text-slate-700">Next settlement · 02 Oct 2026 · GH₵ 21,360</p>
              <p className="mt-4 text-xs text-slate-500">Destination: BOB TRONICS operating account •• 0284 · Demo provider</p>
              <button type="button" onClick={downloadReconciliation} className="mt-5 rounded-lg border border-slate-200 px-4 py-3 text-xs font-semibold text-indigo-900 hover:bg-indigo-50">Download reconciliation</button>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}






