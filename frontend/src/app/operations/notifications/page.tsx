"use client";
import OperationsShell from "@/components/operations/OperationsShell";
export default function NotificationsPage() {
  return <OperationsShell active="Notifications"><p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Notifications</p><h1 className="mt-2 text-3xl font-extrabold">Notifications</h1><p className="mt-2 text-sm text-slate-500">Send updates and monitor important events.</p><section className="mt-6 rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="text-lg font-bold">Notifications are not connected</h2><p className="mt-2 text-sm text-slate-500">The backend notification endpoints returned 404. Sample notifications and local-only send controls have been removed until the backend provides the required API.</p></section></OperationsShell>;
}
