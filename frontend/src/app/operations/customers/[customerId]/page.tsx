"use client";

import Link from "next/link";
import { useState } from "react";
import OperationsShell from "@/components/operations/OperationsShell";

const tabs = ["Orders", "Account activity", "IT requests", "Support"];
const orderRows = [
  ["BT-10482", "01 Oct 2026", "MacBook Air M3", "RWF 14,080", "Packed"],
  ["BT-10211", "12 Sep 2026", "WH-1000XM5", "RWF 3,880", "Delivered"],
  ["BT-10039", "28 Aug 2026", "iPhone 15 Pro", "RWF 12,880", "Delivered"],
];

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-white/70 bg-white p-5 shadow-card sm:p-6"><h2 className="mb-5 text-lg font-bold">{title}</h2>{children}</section>;
}

export default function CustomerDetailPage() {
  const [tab, setTab] = useState("Orders");
  const [name, setName] = useState("David Shema");
  const [email, setEmail] = useState("david.shema@example.com");
  const [phone, setPhone] = useState("+250 78 555 0184");
  const [message, setMessage] = useState("");

  return <OperationsShell active="Customers">
    <p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Detail</p>
    <h1 className="mt-2 text-3xl font-extrabold">Ama Mensah</h1>
    <p className="mt-2 text-sm text-slate-500">Customer since 28 Aug 2026 · Active account</p>
    <div className="mt-5 grid gap-4 sm:grid-cols-3">{[["3", "Lifetime orders"], ["RWF 30,840", "Total spent"], ["1", "IT requests"]].map(([value, label]) => <section key={label} className="rounded-2xl bg-white p-5 shadow-card"><p className="text-2xl font-extrabold">{value}</p><p className="mt-4 text-xs text-slate-500">{label}</p></section>)}</div>
    <div className="mt-5 grid items-start gap-5 xl:grid-cols-2">
      <Card title="Customer information"><div className="space-y-4"><label className="block text-xs font-semibold">Full name<input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal" /></label><label className="block text-xs font-semibold">Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal" /></label><label className="block text-xs font-semibold">Phone<input value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal" /></label></div><span className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">Active account</span><button type="button" onClick={() => setMessage("Customer details saved in this demo session.")} className="mt-4 block rounded-lg bg-[#10139a] px-4 py-3 text-xs font-semibold text-white">Save customer</button></Card>
      <Card title="Default address"><h3 className="text-sm font-semibold">Home · David Shema</h3><p className="mt-5 text-sm">Kigali, Rwanda</p><p className="mt-5 text-sm">+250 78 555 0184</p><button type="button" onClick={() => setMessage("Address editor opened in this demo session.")} className="mt-5 rounded-lg border border-slate-200 px-4 py-3 text-xs font-semibold text-indigo-900">Edit address</button><div className="mt-5 rounded-lg bg-[#efefff] p-4"><p className="text-xs font-bold text-indigo-900">Customer communication</p><p className="mt-1 text-xs leading-relaxed text-slate-500">Email order updates enabled · SMS delivery alerts enabled · Marketing offers disabled</p></div></Card>
    </div>
    {message && <p role="status" className="mt-4 text-xs font-medium text-emerald-700">{message}</p>}
    <div role="tablist" aria-label="Customer details" className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">{tabs.map((item) => <button key={item} role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className={`shrink-0 rounded-lg border px-3.5 py-2.5 text-xs font-semibold ${tab === item ? "border-[#10139a] bg-[#efefff] text-indigo-900" : "border-transparent bg-white text-slate-500"}`}>{item}</button>)}</div>
    {tab === "Orders" && <Card title="Customer orders"><div className="overflow-x-auto rounded-lg border border-slate-200"><table className="w-full min-w-[700px] text-left text-xs"><thead className="bg-slate-50 text-[10px] text-slate-500"><tr>{["Order", "Date", "Product", "Total", "Status", "Action"].map((item) => <th key={item} className="px-3 py-3.5">{item}</th>)}</tr></thead><tbody>{orderRows.map((row, index) => <tr key={row[0]} className="border-t border-slate-200">{row.map((value, i) => i === 0 ? <th key={i} className="px-3 py-4">{value}</th> : <td key={i} className="px-3 py-4">{value}</td>)}<td className="px-3 py-4"><Link href={`/operations/orders/${row[0]}`} className="text-indigo-800">{index === 0 ? "Manage" : "View"}</Link></td></tr>)}</tbody></table></div></Card>}
    {tab === "Account activity" && <Card title="Account activity"><div className="space-y-4 text-sm"><p>01 Oct · 14:32 · Completed payment for BT-10482</p><p>01 Oct · 14:20 · Submitted service request BT-SR-2041</p><p>01 Oct · 14:00 · Signed in from Accra</p><p>28 Aug · 11:10 · Customer account created</p></div></Card>}
    {tab === "IT requests" && <Card title="IT requests"><p className="text-sm">BT-SR-2041 · Network &amp; Setup · Scheduled</p><Link href="/operations/it-requests/BT-SR-2041" className="mt-4 inline-flex text-xs font-semibold text-indigo-800">View request →</Link></Card>}
    {tab === "Support" && <Card title="Support"><p className="text-sm">No open support conversations.</p><a href="mailto:david.shema@example.com" className="mt-4 inline-flex text-xs font-semibold text-indigo-800">Contact customer</a></Card>}
  </OperationsShell>;
}
