"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import OperationsShell from "@/components/operations/OperationsShell";
import { products } from "@/lib/mock-data";

const timeline = [
  { title: "Confirmed", time: "01 Oct · 14:32", detail: "Payment received", done: true },
  { title: "Processing", time: "01 Oct · 15:10", detail: "Order verified by our team", done: true },
  { title: "Packed · Current status", time: "02 Oct · 09:15", detail: "Your device is safely packed", current: true },
  { title: "Out for Delivery", time: "Expected 03 Oct · 09:00", detail: "Courier assignment pending" },
  { title: "Delivered", time: "Expected 03 Oct", detail: "Not yet delivered" },
];

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-white/70 bg-white p-5 shadow-card sm:p-6"><h2 className="mb-5 text-lg font-bold">{title}</h2>{children}</section>;
}

export default function OrderDetailPage() {
  const product = products[0];
  const [status, setStatus] = useState("Packed");
  const [courier, setCourier] = useState("");
  const [note, setNote] = useState("Order verified and packed. Ready for courier assignment.");
  const [message, setMessage] = useState("");

  return <OperationsShell active="Orders">
    <p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Detail</p>
    <h1 className="mt-2 text-3xl font-extrabold">Order BT-10482</h1>
    <p className="mt-2 text-sm text-slate-500">Placed 01 Oct 2026 · 14:32 · Last updated 02 Oct 2026</p>
    <div className="mt-5 flex flex-wrap items-center gap-2"><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">Paid</span><span className="rounded-full bg-indigo-50 px-3 py-1.5 text-[11px] font-semibold text-indigo-800">{status}</span><button type="button" onClick={() => window.print()} className="rounded-lg bg-white px-4 py-3 text-xs font-semibold text-indigo-900">Print invoice</button><label className="sr-only" htmlFor="order-status">Update order status</label><select id="order-status" value={status} onChange={(event) => { setStatus(event.target.value); setMessage("Order status updated in this demo session."); }} className="h-11 rounded-lg bg-[#10139a] px-4 text-xs font-semibold text-white"><option>Packed</option><option>Processing</option><option>Out for Delivery</option><option>Delivered</option><option>On hold</option></select><button type="button" onClick={() => setMessage("More order actions are available in the connected operations system.")} className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900">More actions ▾</button></div>
    {message && <p role="status" className="mt-3 text-xs font-medium text-emerald-700">{message}</p>}

    <div className="mt-5 grid items-start gap-5 xl:grid-cols-[1.6fr_.85fr]">
      <div className="space-y-5">
        <Card title="Order items"><div className="overflow-x-auto rounded-lg border border-slate-200"><table className="w-full min-w-[580px] text-left text-xs"><thead className="bg-slate-50 text-[10px] text-slate-500"><tr>{["Product", "SKU", "Quantity", "Unit price", "Line total"].map((item) => <th key={item} className="px-3 py-3.5">{item}</th>)}</tr></thead><tbody><tr className="border-t border-slate-200"><th className="px-3 py-4">MacBook Air 13”</th><td className="px-3 py-4">BT-APL-M3-256</td><td className="px-3 py-4">1</td><td className="px-3 py-4">RWF 14,500</td><td className="px-3 py-4 text-indigo-800">RWF 14,500</td></tr><tr className="border-t border-slate-200"><th className="px-3 py-4">M3</th><td colSpan={4}></td></tr></tbody></table></div><p className="mt-4 text-xs text-slate-500">Midnight · 8GB RAM · 256GB SSD · 1-year warranty</p></Card>
        <Card title="Order summary"><div className="flex items-center gap-3"><Image src={product.images[0]} alt={product.name} width={90} height={80} className="h-20 w-[90px] rounded-lg object-cover" /><div><p className="text-sm font-semibold">MacBook Air 13” M3</p><p className="mt-1 text-[11px] text-slate-500">Midnight · 8GB / 256GB · Qty 1</p><p className="mt-1 text-xs font-semibold">RWF 14,500</p></div></div><dl className="mt-4 space-y-3 text-xs"><div className="flex justify-between"><dt>Subtotal</dt><dd>RWF 14,500</dd></div><div className="flex justify-between"><dt>Delivery</dt><dd>RWF 80</dd></div><div className="flex justify-between text-emerald-700"><dt>WELCOME500</dt><dd>− RWF 500</dd></div><div className="flex justify-between pt-1 text-lg font-bold"><dt>Total</dt><dd>RWF 14,080</dd></div></dl><p className="mt-5 text-[10px] text-slate-500">Taxes included. Payments are encrypted and secure.</p></Card>
        <Card title="Order timeline"><ol className="space-y-4">{timeline.map((item) => <li key={item.title} className="flex gap-3"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${item.done || item.current ? "bg-[#10139a] text-white" : "border border-slate-200 bg-slate-50 text-slate-500"}`}>{item.done ? "✓" : item.current ? "•" : "○"}</span><div><p className={`text-sm font-semibold ${!item.done && !item.current ? "text-slate-500" : ""}`}>{item.title}</p><p className="mt-1 text-[11px] text-slate-500">{item.time}</p><p className="mt-1 text-xs text-slate-500">{item.detail}</p></div></li>)}</ol></Card>
        <Card title="Internal notes"><label className="block text-xs font-semibold">Add an internal note<textarea value={note} onChange={(event) => setNote(event.target.value)} className="mt-2 min-h-28 w-full resize-y rounded-lg border border-slate-200 p-3 text-xs font-normal" /></label><button type="button" onClick={() => setMessage("Note saved in this demo session.")} className="mt-4 rounded-lg border border-slate-200 px-4 py-3 text-xs font-semibold text-indigo-900">Save note</button><p className="mt-4 text-[10px] text-slate-500">Emmanuel K. · 02 Oct 2026 · 09:15 · Visible to team only</p></Card>
      </div>
      <div className="space-y-5">
        <Card title="Customer"><h3 className="text-xl font-bold">David Shema</h3><p className="mt-5 text-xs">david.shema@example.com</p><p className="mt-5 text-sm">+250 78 555 0184</p><Link href="/operations/customers" className="mt-5 inline-flex rounded-lg border border-slate-200 px-4 py-3 text-xs font-semibold text-indigo-900">View customer profile</Link></Card>
        <Card title="Payment"><span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">Paid · GH₵ 14,080</span><p className="mt-5 text-xs">MTN Mobile Money · MM-882140</p><p className="mt-5 text-xs">01 Oct 2026 · 14:32</p><Link href="/operations/payments" className="mt-5 inline-flex rounded-lg border border-slate-200 px-4 py-3 text-xs font-semibold text-indigo-900">View transaction</Link><button type="button" onClick={() => setMessage("Refund requested in this demo session.")} className="mt-4 block text-xs font-medium text-indigo-800">Issue refund</button></Card>
        <Card title="Delivery"><p className="text-xs">Nyarugenge · Standard · RWF 80</p><p className="mt-5 text-xs">Estimated 03 Oct 2026</p><p className="mt-5 text-xs">Note: Please call before arriving at the gate.</p><label className="mt-5 block text-xs font-semibold">Courier<select value={courier} onChange={(event) => setCourier(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal"><option value="">Select courier</option><option>Daniel A.</option><option>Abena T.</option></select></label><button type="button" onClick={() => setMessage(courier ? `${courier} assigned in this demo session.` : "Choose a courier before dispatch.")} className="mt-4 rounded-lg bg-[#10139a] px-4 py-3 text-xs font-semibold text-white">Assign &amp; dispatch</button></Card>
      </div>
    </div>
  </OperationsShell>;
}

