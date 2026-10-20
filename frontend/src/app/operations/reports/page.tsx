"use client";
import OperationsShell from "@/components/operations/OperationsShell";
export default function OperationsReportsPage() {
  return <OperationsShell active="Reports"><p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Reports</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight">Reports</h1><p className="mt-2 text-sm text-slate-500">Turn your operations into actionable insights.</p><section className="mt-6 rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="text-lg font-bold">Reports are not connected</h2><p className="mt-2 text-sm text-slate-500">The backend report summary and export endpoints returned 404. Sample metrics and charts have been removed until the backend API is available.</p></section></OperationsShell>;
}
