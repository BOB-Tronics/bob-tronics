"use client";
import Link from "next/link";

import { useMemo, useState } from "react";
import OperationsShell from "@/components/operations/OperationsShell";

const tabs = ["All requests (18)", "Pending (4)", "Scheduled (8)", "In progress (3)", "Completed (3)"];
const requests = [
  { id: "BT-SR-2041", customer: "David Shema", service: "Network & Setup", appointment: "06 Oct · 10:00", status: "Scheduled" },
  { id: "BT-SR-2040", customer: "Kofi Asante", service: "Technical Support", appointment: "03 Oct · 14:00", status: "Pending" },
  { id: "BT-SR-2039", customer: "Esi Boateng", service: "IT Consulting", appointment: "04 Oct · 11:00", status: "Assigned" },
  { id: "BT-SR-2038", customer: "Nana Adjei", service: "Device Setup", appointment: "02 Oct · 09:00", status: "In progress" },
  { id: "BT-SR-2037", customer: "Akua Osei", service: "Security & Backup", appointment: "30 Sep · 10:00", status: "Completed" },
];

export default function ItRequestsPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState(tabs[0]);
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    const status = tab.split(" (")[0];
    return requests.filter((request) => (status === "All requests" || request.status === status) &&
      (!query || [request.id, request.customer, request.service].some((value) => value.toLowerCase().includes(query))));
  }, [search, tab]);

  return <OperationsShell active="IT Requests">
    <p className="text-[10px] font-bold uppercase text-indigo-800">Operations / IT Requests</p>
    <h1 className="mt-2 text-3xl font-extrabold">IT Requests</h1>
    <p className="mt-2 text-sm text-slate-500">Manage appointments, specialists and service progress.</p>
    <div className="mt-6 flex flex-wrap items-end gap-3">
      <label className="min-w-[240px] flex-1 text-xs font-semibold">Search IT requests<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Enter keyword" className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal" /></label>
      <select aria-label="Filter service" className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900"><option>Filters · All services</option><option>Network &amp; Setup</option><option>Technical Support</option></select>
      <button className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900">Export</button>
    </div>
    <div role="tablist" aria-label="Request status" className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">{tabs.map((item) => <button key={item} role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className={`shrink-0 rounded-lg border px-3.5 py-2.5 text-xs font-semibold ${tab === item ? "border-[#10139a] bg-[#efefff] text-indigo-900" : "border-transparent bg-white text-slate-500"}`}>{item}</button>)}</div>
    <section className="mt-5 rounded-2xl bg-white p-5 shadow-card sm:p-6">
      <h2 className="mb-5 text-lg font-bold">Service requests</h2>
      <div className="overflow-x-auto rounded-lg border border-slate-200"><table className="w-full min-w-[760px] text-left text-xs">
        <thead className="bg-slate-50 text-[10px] text-slate-500"><tr>{["Request", "Customer", "Service", "Appointment", "Status", "Actions"].map((label) => <th key={label} className="px-3 py-3.5 font-semibold">{label}</th>)}</tr></thead>
        <tbody>{visible.map((request) => <tr key={request.id} className="border-t border-slate-200"><th className="px-3 py-4 font-semibold">{request.id}</th><td className="px-3 py-4">{request.customer}</td><td className="px-3 py-4">{request.service}</td><td className="px-3 py-4">{request.appointment}</td><td className="px-3 py-4">{request.status}</td><td className="px-3 py-4"><Link href={`/operations/it-requests/${request.id}`} className="whitespace-nowrap font-semibold text-indigo-800">{request.status === "Pending" ? "Assign specialist" : request.status === "Completed" ? "View report →" : "View request →"}</Link></td></tr>)}</tbody>
      </table></div>
      {visible.length === 0 && <p className="p-6 text-sm text-slate-500">No requests match your search and status.</p>}
    </section>
    <section className="mt-5 rounded-2xl bg-white p-5 shadow-card sm:p-6">
      <h2 className="text-lg font-bold">Upcoming appointment</h2><span className="mt-4 inline-flex rounded-full bg-[#efefff] px-3 py-1.5 text-[11px] font-semibold text-indigo-900">06 Oct 2026 · 10:00 AM</span>
      <h3 className="mt-5 text-xl font-bold">Network &amp; Setup · Ama Mensah</h3><p className="mt-4 text-sm text-slate-500">Nyarugenge · On-site</p>
      <p className="mt-4 text-sm">Secure Wi-Fi for an 8-person office, guest access and coverage across two rooms.</p>
      <Link href="/operations/it-requests/BT-SR-2041" className="mt-5 inline-flex rounded-lg bg-[#10139a] px-4 py-3 text-xs font-semibold text-white">Open BT-SR-2041 →</Link>
    </section>
  </OperationsShell>;
}



