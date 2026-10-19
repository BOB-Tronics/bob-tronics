"use client";

import { useMemo, useState } from "react";
import OperationsShell from "@/components/operations/OperationsShell";
import DemoDataBadge from "@/components/operations/DemoDataBadge";

const reportTabs = ["Sales", "Revenue", "Orders", "Inventory", "Product performance"];
const metrics = [
  ["RWF 262,400", "Gross sales"],
  ["RWF 248,600", "Net revenue"],
  ["142", "Orders"],
  ["RWF 1,751", "Average order value"],
];
const products = [
  ["MacBook Air M3", "12", "RWF 174,000", "4.8%", "18", "↑ 18%"],
  ["iPhone 15 Pro", "8", "RWF 102,400", "4.2%", "24", "↑ 12%"],
  ["PlayStation 5 Slim", "15", "RWF 108,000", "5.1%", "12", "↑ 21%"],
  ["WH-1000XM5", "20", "RWF 76,000", "6.8%", "28", "↑ 9%"],
];
const health = [
  ["In-stock units", "1,284", "1,192", "+7.7%"],
  ["Low-stock products", "8", "12", "−33.3%"],
  ["Delivered orders", "118", "102", "+15.7%"],
  ["Average fulfillment", "2.4 days", "2.8 days", "−0.4 days"],
];

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return <div className="overflow-x-auto rounded-lg border border-slate-200"><table className="w-full min-w-[680px] text-left text-xs"><thead className="bg-slate-50 text-[10px] text-slate-500"><tr>{headers.map((header) => <th key={header} className="px-3 py-3.5 font-semibold">{header}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row[0]} className="border-t border-slate-200">{row.map((cell, index) => index === 0 ? <th key={index} className="whitespace-nowrap px-3 py-4 font-semibold">{cell}</th> : <td key={index} className="whitespace-nowrap px-3 py-4">{cell}</td>)}</tr>)}</tbody></table></div>;
}

export default function OperationsReportsPage() {
  const [tab, setTab] = useState("Sales");
  const [query, setQuery] = useState("");
  const visibleProducts = useMemo(() => products.filter((row) => row[0].toLowerCase().includes(query.trim().toLowerCase())), [query]);

  return <OperationsShell active="Reports">
    <p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Reports</p>
    <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Reports</h1><DemoDataBadge />
    <p className="mt-2 text-sm text-slate-500">Turn your operations into actionable insights.</p>

    <div className="mt-6 flex flex-wrap items-end gap-3">
      <label className="min-w-[240px] flex-1 text-xs font-semibold">Search reports<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Enter keyword" className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none placeholder:text-slate-400 focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100" /></label>
      <select aria-label="Filters" className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900"><option>Filters ▾</option><option>All products</option><option>Published</option></select>
      <button type="button" onClick={() => window.print()} className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900 hover:bg-indigo-50">Export</button>
    </div>

    <div role="tablist" aria-label="Report type" className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">{reportTabs.map((item) => <button key={item} role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className={`shrink-0 rounded-lg border px-3.5 py-2.5 text-xs font-semibold ${tab === item ? "border-[#10139a] bg-[#efefff] text-indigo-900" : "border-transparent bg-white text-slate-500 hover:bg-indigo-50"}`}>{item}</button>)}</div>

    <div className="mt-5 grid gap-3 md:grid-cols-3"><label className="block text-xs font-semibold">Date range<select className="mt-2 h-11 w-full rounded-lg border-0 bg-white px-3 text-sm font-normal"><option>01–30 Sep 2026</option><option>01–31 Aug 2026</option><option>This year</option></select></label><label className="block text-xs font-semibold">Category<select className="mt-2 h-11 w-full rounded-lg border-0 bg-white px-3 text-sm font-normal"><option>All categories</option><option>Laptops</option><option>Phones</option><option>Gaming</option><option>Accessories</option></select></label><label className="block text-xs font-semibold">Compare with<select className="mt-2 h-11 w-full rounded-lg border-0 bg-white px-3 text-sm font-normal"><option>Previous period</option><option>Same period last year</option><option>No comparison</option></select></label></div>

    <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([value, label]) => <section key={label} className="rounded-2xl border border-white/70 bg-white p-5 shadow-card"><p className="text-2xl font-extrabold tracking-tight">{value}</p><p className="mt-4 text-xs text-slate-500">{label}</p><span className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">↑ vs previous period</span></section>)}</div>

    <section className="mt-5 rounded-2xl border border-white/70 bg-white p-5 shadow-card sm:p-6"><h2 className="text-lg font-bold">{tab === "Sales" ? "Sales & revenue over time" : `${tab} over time`}</h2><div className="mt-5 flex items-center justify-between"><p className="text-2xl font-extrabold">RWF 248,600</p><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">↑ 18.6%</span></div><div className="relative mt-4 h-64 pl-9"><div className="absolute inset-y-0 left-0 flex flex-col justify-between pb-7 text-[10px] text-slate-400">{["250k", "200k", "150k", "100k", "50k"].map((x) => <span key={x}>{x}</span>)}</div><svg viewBox="0 0 1000 250" preserveAspectRatio="none" className="h-full w-full" role="img" aria-label="Sales and revenue trend, increasing through September"><g stroke="#e5eaf3" strokeWidth="1">{[8, 55, 102, 149, 196].map((y) => <line key={y} x1="0" y1={y} x2="1000" y2={y} />)}</g><path d="M8 174 C70 150 95 165 155 142 S230 98 292 111 S370 123 415 82 S505 97 560 91 S635 35 695 56 S780 86 825 39 S905 34 945 41 S980 50 995 37" fill="none" stroke="#10139a" strokeWidth="4" strokeLinecap="round" /></svg><div className="absolute bottom-0 left-9 right-0 flex justify-between text-[10px] text-slate-500"><span>01 Sep</span><span>07 Sep</span><span>14 Sep</span><span>21 Sep</span><span>30 Sep</span></div></div><div className="mt-5 flex gap-6 pl-6 text-[11px] text-slate-500"><span>Revenue</span><span>Previous period · September 2026</span></div></section>

    <section className="mt-5 rounded-2xl border border-white/70 bg-white p-5 shadow-card sm:p-6"><h2 className="mb-5 text-lg font-bold">Product performance</h2><DataTable headers={["Product", "Units sold", "Revenue", "Conversion", "Stock", "Trend"]} rows={visibleProducts} /><p className="mt-5 text-[11px] text-slate-500">Product performance · Year to date · Jan–Sep 2026</p></section>
    <section className="mt-5 rounded-2xl border border-white/70 bg-white p-5 shadow-card sm:p-6"><h2 className="mb-5 text-lg font-bold">Inventory &amp; order health</h2><DataTable headers={["Metric", "Current", "Previous", "Change"]} rows={health} /></section>
  </OperationsShell>;
}
