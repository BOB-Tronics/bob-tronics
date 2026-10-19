"use client";

import { useMemo, useState, type FormEvent } from "react";
import OperationsShell from "@/components/operations/OperationsShell";

type Notice = { id: number; title: string; detail: string; source: string; time: string; kind: string };
const tabs = ["Activity feed", "Customer messages", "Scheduled", "Templates"];
const startNotices: Notice[] = [
  { id: 1, title: "Low stock alert", detail: "Galaxy S24 Ultra · 3 units remaining", source: "Inventory", time: "01 Oct · 14:40", kind: "Activity feed" },
  { id: 2, title: "New payment received", detail: "RWF 14,080 · David Shema · BT-10482", source: "Payments", time: "01 Oct · 14:32", kind: "Activity feed" },
  { id: 3, title: "New service request", detail: "Network & Setup · BT-SR-2041", source: "IT Requests", time: "01 Oct · 14:20", kind: "Activity feed" },
  { id: 4, title: "Delivery completed", detail: "BT-10479 · Proof of delivery available", source: "Deliveries", time: "30 Sep · 17:10", kind: "Activity feed" },
  { id: 5, title: "Your order is ready", detail: "Packed and ready for courier collection.", source: "Customer message", time: "02 Oct · 09:00", kind: "Customer messages" },
  { id: 6, title: "October product update", detail: "Your upgrade is almost there.", source: "Scheduled", time: "05 Oct · 09:00", kind: "Scheduled" },
];

export default function NotificationsPage() {
  const [notices, setNotices] = useState(startNotices);
  const [tab, setTab] = useState(tabs[0]);
  const [search, setSearch] = useState("");
  const [audience, setAudience] = useState("Customers with packed orders");
  const [channel, setChannel] = useState("Email + SMS");
  const [subject, setSubject] = useState("Your upgrade is almost there");
  const [message, setMessage] = useState("Your order is packed and ready for courier collection. We’ll notify you when it’s on the way.");
  const [preview, setPreview] = useState(false);
  const [sent, setSent] = useState(false);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return notices.filter((notice) => (tab === "Activity feed" || notice.kind === tab) &&
      (!query || [notice.title, notice.detail, notice.source].some((text) => text.toLowerCase().includes(query))));
  }, [notices, tab, search]);

  function openPreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(false);
    setPreview(true);
  }

  function send() {
    setNotices((current) => [{ id: Date.now(), title: subject, detail: message, source: "Customer message", time: "Just now", kind: "Customer messages" }, ...current]);
    setPreview(false);
    setTab("Customer messages");
    setSent(true);
  }

  return <OperationsShell active="Notifications">
    <p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Notifications</p>
    <h1 className="mt-2 text-3xl font-extrabold">Notifications</h1>
    <p className="mt-2 text-sm text-slate-500">Send updates and monitor important events.</p>
    <div className="mt-6 flex flex-wrap items-end gap-3">
      <label className="min-w-[240px] flex-1 text-xs font-semibold">Search notifications<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Enter keyword" className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal" /></label>
      <select aria-label="Notification filter" className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900"><option>Filters · All notifications</option><option>Inventory</option><option>Payments</option></select>
      <button className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900">Export</button>
      <button onClick={() => document.getElementById("create-notification")?.scrollIntoView({ behavior: "smooth" })} className="h-11 rounded-lg bg-[#10139a] px-4 text-xs font-semibold text-white">＋ Create notification</button>
    </div>
    <div role="tablist" aria-label="Notification view" className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">{tabs.map((item) => <button key={item} role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className={`shrink-0 rounded-lg border px-3.5 py-2.5 text-xs font-semibold ${tab === item ? "border-[#10139a] bg-[#efefff] text-indigo-900" : "border-transparent bg-white text-slate-500"}`}>{item}</button>)}</div>
    <section className="mt-5 rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="mb-5 text-lg font-bold">Operations notifications</h2><div className="space-y-4">
      {visible.map((notice) => <article key={notice.id} className="rounded-lg bg-slate-50 p-4"><h3 className="text-sm font-bold">{notice.title}</h3><p className="mt-2 text-sm">{notice.detail}</p><p className="mt-2 text-[11px] text-slate-500">{notice.source} · {notice.time}</p></article>)}
      {!visible.length && <p className="rounded-lg bg-slate-50 p-6 text-sm text-slate-500">No notifications match your search.</p>}
    </div></section>
    <section id="create-notification" className="mt-5 rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="mb-5 text-lg font-bold">Create customer notification</h2>
      <form onSubmit={openPreview} className="space-y-4">
        <label className="block text-xs font-semibold">Audience<select value={audience} onChange={(event) => setAudience(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal"><option>Customers with packed orders</option><option>All customers</option><option>New customers</option><option>Returning customers</option></select></label>
        <label className="block text-xs font-semibold">Channel<select value={channel} onChange={(event) => setChannel(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal"><option>Email + SMS</option><option>Email</option><option>SMS</option></select></label>
        <label className="block text-xs font-semibold">Subject<input required value={subject} onChange={(event) => setSubject(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal" /></label>
        <label className="block text-xs font-semibold">Message<textarea required value={message} onChange={(event) => setMessage(event.target.value)} className="mt-2 min-h-28 w-full resize-y rounded-lg border border-slate-200 px-3 py-3 text-sm font-normal" /></label>
        <button className="rounded-lg bg-[#10139a] px-4 py-3 text-xs font-semibold text-white">Preview &amp; send</button>
        {sent && <p role="status" className="text-xs font-semibold text-emerald-700">Notification added to the demo customer messages feed.</p>}
      </form>
      {preview && <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 p-4"><p className="text-xs font-semibold text-indigo-800">Preview · {audience} · {channel}</p><h3 className="mt-3 font-bold">{subject}</h3><p className="mt-2 text-sm">{message}</p><div className="mt-4 flex gap-2"><button onClick={send} className="rounded-lg bg-[#10139a] px-4 py-2.5 text-xs font-semibold text-white">Send notification</button><button onClick={() => setPreview(false)} className="rounded-lg border bg-white px-4 py-2.5 text-xs">Back to edit</button></div></div>}
    </section>
  </OperationsShell>;
}


