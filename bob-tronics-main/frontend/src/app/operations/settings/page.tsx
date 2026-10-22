"use client";
import { useState } from "react";
import OperationsShell from "@/components/operations/OperationsShell";
const tabs = ["General", "Payments", "Delivery", "Team & roles", "Notifications", "Security"];
export default function OperationsSettingsPage() {
  const [tab, setTab] = useState("General");
  return <OperationsShell active="Settings"><p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Settings</p><h1 className="mt-2 text-3xl font-extrabold">Settings</h1><p className="mt-2 text-sm text-slate-500">Configure your store, team and operating preferences.</p><div role="tablist" aria-label="Settings sections" className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">{tabs.map((item) => <button key={item} role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className={`shrink-0 rounded-lg border px-3.5 py-2.5 text-xs font-semibold ${tab === item ? "border-[#10139a] bg-[#efefff] text-indigo-900" : "border-transparent bg-white text-slate-500"}`}>{item}</button>)}</div><section className="mt-5 rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="text-lg font-bold">{tab} settings are not connected</h2><p className="mt-2 text-sm text-slate-500">The backend settings endpoint returned 404. Sample values and local-only save controls have been removed so changes cannot appear saved when they are not stored.</p></section></OperationsShell>;
}
