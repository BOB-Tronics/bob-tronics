"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import OperationsShell from "@/components/operations/OperationsShell";
import { adminListOrders, type AdminOrderRow } from "@/services/admin";
const tabs = ["All transactions", "Successful", "Pending", "Failed"];
function matchesStatus(row: AdminOrderRow, tab: string) {
  const status = row.paymentStatus.toLowerCase();
  return tab === "All transactions" || (tab === "Successful" ? status.includes("paid") || status.includes("successful") : status.includes(tab.toLowerCase()));
}
export default function OperationsPaymentsPage() {
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState(tabs[0]);
  const load = useCallback(async () => {
    setLoading(true); setError(false);
    try { setOrders((await adminListOrders()).results); } catch { setError(true); } finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((row) => matchesStatus(row, tab) && (!query || [row.paymentReference, row.id, row.customerName, row.customerEmail].some((value) => value.toLowerCase().includes(query))));
  }, [orders, search, tab]);
  function exportPayments() {
    const csv = [["Reference", "Order", "Customer", "Method", "Amount", "Status"], ...visible.map((row) => [row.paymentReference, row.id, row.customerName, row.paymentMethod, row.totalAmount, row.paymentStatus])].map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "bob-tronics-payments.csv"; link.click(); URL.revokeObjectURL(url);
  }
  return <OperationsShell active="Payments">
    <p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Payments</p><h1 className="mt-2 text-3xl font-extrabold">Payments</h1><p className="mt-2 text-sm text-slate-500">Payment details below come from live orders. A dedicated payments API is not available.</p>
    <div className="mt-6 flex flex-wrap items-end gap-3"><label className="min-w-[240px] flex-1 text-xs font-semibold">Search payments<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Order, customer, or reference" className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal" /></label><button type="button" onClick={exportPayments} disabled={loading || error || visible.length === 0} className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900 disabled:opacity-50">Export</button></div>
    <div role="tablist" aria-label="Payment status" className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">{tabs.map((item) => <button key={item} role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className={`shrink-0 rounded-lg border px-3.5 py-2.5 text-xs font-semibold ${tab === item ? "border-[#10139a] bg-[#efefff] text-indigo-900" : "border-transparent bg-white text-slate-500"}`}>{item}</button>)}</div>
    <section className="mt-5 rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="mb-5 text-lg font-bold">Order payment ledger</h2>{loading ? <p role="status" className="rounded-lg bg-slate-50 p-6 text-sm text-slate-500">Loading payment details…</p> : error ? <div className="rounded-lg bg-slate-50 p-6 text-sm text-slate-500"><p>Unable to load payment details.</p><button onClick={() => void load()} className="mt-3 rounded-lg bg-[#10139a] px-4 py-2.5 text-xs font-semibold text-white">Retry</button></div> : <div className="overflow-x-auto rounded-lg border border-slate-200"><table className="w-full min-w-[760px] text-left text-xs"><thead className="bg-slate-50 text-[10px] text-slate-500"><tr>{["Reference", "Order / Customer", "Method", "Amount", "Status"].map((h) => <th key={h} className="px-3 py-3.5 font-semibold">{h}</th>)}</tr></thead><tbody>{visible.map((row) => <tr key={row.id} className="border-t border-slate-200"><th className="px-3 py-4 font-semibold">{row.paymentReference}</th><td className="px-3 py-4">{row.id} / {row.customerName}</td><td className="px-3 py-4">{row.paymentMethod}</td><td className="px-3 py-4">{row.totalAmount}</td><td className="px-3 py-4">{row.paymentStatus}</td></tr>)}{visible.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">{orders.length === 0 ? "No order payment details are available." : "No payments match your search and filter."}</td></tr>}</tbody></table></div>}{!loading && !error && <p className="mt-4 text-[11px] text-slate-500">Showing loaded orders. Settlement and provider transactions need a dedicated payments endpoint.</p>}</section>
  </OperationsShell>;
}
