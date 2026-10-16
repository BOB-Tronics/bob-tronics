"use client";

import { useMemo, useState, type FormEvent } from "react";
import OperationsShell from "@/components/operations/OperationsShell";

type Delivery = { order: string; customer: string; destination: string; courier: string; status: string };
const tabs = ["All deliveries", "Ready (6)", "In transit (8)", "Delivered (10)"];
const start: Delivery[] = [
  { order: "BT-10482", customer: "David Shema", destination: "Osu, Accra", courier: "Unassigned", status: "Packed" },
  { order: "BT-10481", customer: "Kofi Asante", destination: "East Legon", courier: "Unassigned", status: "Processing" },
  { order: "BT-10478", customer: "Nana Adjei", destination: "Ridge, Accra", courier: "Daniel A.", status: "Out for Delivery" },
  { order: "BT-10479", customer: "Kwame Owusu", destination: "Osu, Accra", courier: "Daniel A.", status: "Delivered" },
];

function matchesStatus(status: string, tab: string) {
  if (tab.startsWith("Ready")) return status === "Packed" || status === "Processing";
  if (tab.startsWith("In transit")) return status === "Out for Delivery";
  if (tab.startsWith("Delivered")) return status === "Delivered";
  return true;
}

export default function OperationsDeliveriesPage() {
  const [deliveries, setDeliveries] = useState(start);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState(tabs[0]);
  const [selectedId, setSelectedId] = useState("BT-10482");
  const [courier, setCourier] = useState("");
  const [date, setDate] = useState("2026-10-03T09:00");
  const [note, setNote] = useState("Please call before arriving at the gate.");
  const [saved, setSaved] = useState(false);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return deliveries.filter((item) => matchesStatus(item.status, tab) &&
      (!query || [item.order, item.customer, item.destination].some((value) => value.toLowerCase().includes(query))));
  }, [deliveries, search, tab]);
  const selected = deliveries.find((item) => item.order === selectedId);

  function selectDelivery(item: Delivery) {
    setSelectedId(item.order);
    setCourier(item.courier === "Unassigned" ? "" : item.courier);
    setSaved(false);
  }

  function assignCourier(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!courier) return;
    setDeliveries((current) => current.map((item) => item.order === selectedId ? { ...item, courier, status: "Out for Delivery" } : item));
    setSaved(true);
  }

  return <OperationsShell active="Deliveries">
    <p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Deliveries</p>
    <h1 className="mt-2 text-3xl font-extrabold">Deliveries</h1>
    <p className="mt-2 text-sm text-slate-500">Coordinate dispatch and keep customers informed.</p>
    <div className="mt-6 flex flex-wrap items-end gap-3">
      <label className="min-w-[240px] flex-1 text-xs font-semibold">Search deliveries<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Enter keyword" className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal" /></label>
      <select aria-label="Courier filter" className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900"><option>Filters · All couriers</option><option>Unassigned</option><option>Daniel A.</option></select>
      <button className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900">Export</button>
    </div>
    <div role="tablist" aria-label="Delivery status" className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">{tabs.map((item) => <button key={item} role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className={`shrink-0 rounded-lg border px-3.5 py-2.5 text-xs font-semibold ${tab === item ? "border-[#10139a] bg-[#efefff] text-indigo-900" : "border-transparent bg-white text-slate-500"}`}>{item}</button>)}</div>
    <section className="mt-5 rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="mb-5 text-lg font-bold">Delivery management</h2>
      <div className="overflow-x-auto rounded-lg border border-slate-200"><table className="w-full min-w-[760px] text-left text-xs"><thead className="bg-slate-50 text-[10px] text-slate-500"><tr>{["Order", "Customer", "Destination", "Courier", "Status", "Actions"].map((heading) => <th key={heading} className="px-3 py-3.5 font-semibold">{heading}</th>)}</tr></thead>
        <tbody>{visible.map((item) => <tr key={item.order} className="border-t border-slate-200"><th className="px-3 py-4 font-semibold">{item.order}</th><td className="px-3 py-4">{item.customer}</td><td className="px-3 py-4">{item.destination}</td><td className="px-3 py-4">{item.courier}</td><td className="px-3 py-4">{item.status}</td><td className="px-3 py-4"><button onClick={() => selectDelivery(item)} className="whitespace-nowrap font-semibold text-indigo-800">{item.courier === "Unassigned" ? "Assign courier" : item.status === "Delivered" ? "View proof" : "Track →"}</button></td></tr>)}</tbody>
      </table></div>{!visible.length && <p className="p-6 text-sm text-slate-500">No deliveries match your search and status.</p>}
    </section>
    <div className="mt-5 grid gap-5 xl:grid-cols-2">
      <section className="rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="mb-5 text-lg font-bold">Dispatch area</h2><div className="relative overflow-hidden rounded-xl bg-[#e8e9e7]">
        <svg viewBox="0 0 440 300" className="h-[300px] w-full" role="img" aria-label="Static dispatch map for Kigali, Nyarugenge"><path d="M0 245Q80 230 150 260T300 245T440 250V300H0Z" fill="#285b8f"/><g fill="#cce9d2"><path d="M28 25h58v32H28zM145 18h40v44h-40zM302 28h65v32h-65zM60 116h52v28H60zM235 96h58v38h-58zM350 145h52v34h-52zM125 188h42v26h-42z"/></g><g stroke="#fff" strokeWidth="5" fill="none"><path d="M-10 70L150 230 286 92 455 220M22 30L215 180 350 58 452 130M-5 160L130 65 274 220 420 90M90 -10L45 295M210 -10L180 270M330 -10L290 282M400 -10L365 255"/></g><g stroke="#d1d5d4" strokeWidth="2"><path d="M0 90L155 250M20 55L240 245M170 0L440 215M0 205L290 30M60 290L375 0M0 125L440 170"/></g><path d="M70 210H125V160H215V80H300" fill="none" stroke="#10139a" strokeWidth="4"/><circle cx="300" cy="80" r="18" fill="#10139a"/><circle cx="300" cy="80" r="6" fill="white"/></svg><span className="absolute bottom-4 left-4 rounded-lg bg-white px-3 py-2 text-[10px] font-semibold shadow">Kigali, Nyarugenge · Static demo map</span>
      </div></section>
      {selected && (selected.courier === "Unassigned" || selected.status === "Packed" || selected.status === "Processing") ? <section className="rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="mb-5 text-lg font-bold">Assign delivery · {selected.order}</h2><p className="mb-5 text-sm">{selected.customer} · Nyarugenge</p>
        <form onSubmit={assignCourier} className="space-y-4">
          <label className="block text-xs font-semibold">Courier<select required value={courier} onChange={(event) => setCourier(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal"><option value="">Select available courier</option><option>Daniel A.</option><option>Grace M.</option><option>Peter K.</option></select></label>
          <label className="block text-xs font-semibold">Dispatch date<input type="datetime-local" value={date} onChange={(event) => setDate(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal"/></label>
          <label className="block text-xs font-semibold">Delivery note<textarea value={note} onChange={(event) => setNote(event.target.value)} className="mt-2 min-h-28 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm font-normal"/></label>
          <button className="rounded-lg bg-[#10139a] px-4 py-3 text-xs font-semibold text-white">Assign courier</button>{saved && <p role="status" className="text-xs font-semibold text-emerald-700">Courier assigned. Delivery is now in transit.</p>}
        </form>
      </section> : <section className="rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="text-lg font-bold">{selected?.status === "Delivered" ? "Proof of delivery" : "Delivery tracking"} · {selected?.order}</h2><p className="mt-5 text-sm">{selected?.customer} · {selected?.destination}</p><p className="mt-2 text-sm text-slate-500">{selected?.courier} · {selected?.status}</p><p className="mt-5 rounded-lg bg-slate-50 p-4 text-sm">{selected?.status === "Delivered" ? "Delivery completed successfully." : "Courier route is shown on the dispatch map."}</p></section>}
    </div>
  </OperationsShell>;
}

