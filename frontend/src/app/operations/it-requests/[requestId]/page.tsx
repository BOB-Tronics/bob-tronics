"use client";

import Link from "next/link";
import { useState } from "react";
import OperationsShell from "@/components/operations/OperationsShell";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-white/70 bg-white p-5 shadow-card sm:p-6"><h2 className="mb-5 text-lg font-bold">{title}</h2>{children}</section>;
}

export default function ServiceRequestDetailPage() {
  const [status, setStatus] = useState("Scheduled");
  const [specialist, setSpecialist] = useState("Michael O. · Network engineer");
  const [fee, setFee] = useState("Pending assessment");
  const [priority, setPriority] = useState("Normal");
  const [note, setNote] = useState("Assess router placement and guest network requirements before quoting.");
  const [message, setMessage] = useState("");

  return <OperationsShell active="IT Requests">
    <p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Detail</p>
    <h1 className="mt-2 text-3xl font-extrabold">Request BT-SR-2041</h1>
    <p className="mt-2 text-sm text-slate-500">Network &amp; Setup · Appointment 06 Oct 2026 · 10:00 AM</p>
    <div className="mt-5 flex flex-wrap items-center gap-3"><span className="rounded-full bg-indigo-50 px-3 py-1.5 text-[11px] font-semibold text-indigo-800">{status}</span><select aria-label="Update status" value={status} onChange={(event) => { setStatus(event.target.value); setMessage("Request status updated in this demo session."); }} className="h-11 rounded-lg bg-[#10139a] px-4 text-xs font-semibold text-white"><option>Scheduled</option><option>Pending</option><option>Assigned</option><option>In progress</option><option>Completed</option></select><a href="mailto:david.shema@example.com" className="inline-flex h-11 items-center rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900">Contact customer</a></div>
    {message && <p role="status" className="mt-3 text-xs font-medium text-emerald-700">{message}</p>}
    <div className="mt-5 grid items-start gap-5 xl:grid-cols-[1.6fr_.85fr]">
      <div className="space-y-5">
        <Card title="Service request"><h3 className="text-2xl font-bold">Network &amp; Setup</h3><p className="mt-4 text-sm leading-relaxed">Set up a secure Wi-Fi network for our 8-person office. We need router configuration, guest access and reliable coverage across two rooms.</p><label className="mt-5 block text-xs font-semibold">Attachment<a href="/files/office-floorplan.pdf" download className="mt-2 flex h-11 items-center rounded-lg border border-slate-200 px-3 text-xs font-normal text-indigo-900">office-floorplan.pdf · 1.2MB · Download ↓</a></label><p className="mt-5 text-xs text-slate-500">Submitted 01 Oct 2026 · 14:20 · BT-SR-2041</p></Card>
        <Card title="Appointment &amp; location"><h3 className="text-xl font-bold">06 Oct 2026 · 10:00 AM · On-site</h3><p className="mt-5 text-sm">Kigali, Rwanda</p><div className="relative mt-5 overflow-hidden rounded-xl bg-[#e8e9e7]"><svg viewBox="0 0 700 300" className="h-[300px] w-full" role="img" aria-label="Static demo map around Osu, Accra"><path d="M0 250Q140 230 250 260T480 248T700 240V300H0Z" fill="#6894aa"/><g fill="#cce9d2"><path d="M24 25h68v35H24zM165 15h45v50h-45zM410 28h68v38h-68zM75 122h60v33H75zM300 95h68v40h-68zM555 140h62v36h-62zM210 195h48v30h-48z"/></g><g stroke="#fff" strokeWidth="5" fill="none"><path d="M-10 75L180 230 310 95 710 218M18 30L265 180 460 55 705 130M-5 170L165 55 345 220 620 85M110 -5L52 295M295 -5L260 270M480 -5L440 280M620 -5L580 260"/></g><g stroke="#d1d5d4" strokeWidth="2"><path d="M0 95L220 250M45 42L340 240M275 0L700 215M0 210L420 30M70 290L600 0M0 135L700 170"/></g><path d="M75 220H150V155H260V82H355" fill="none" stroke="#10139a" strokeWidth="4"/><circle cx="355" cy="82" r="20" fill="#10139a"/><circle cx="355" cy="82" r="7" fill="white"/></svg><span className="absolute bottom-4 left-4 rounded-lg bg-white px-3 py-2 text-[10px] font-semibold">Osu, Accra · Static demo map</span></div><button type="button" onClick={() => setMessage("Reschedule request opened in this demo session.")} className="mt-5 rounded-lg border border-slate-200 px-4 py-3 text-xs font-semibold text-indigo-900">Reschedule appointment</button></Card>
        <Card title="Service activity"><div className="space-y-4 text-sm"><p>01 Oct · 16:00 · Appointment confirmed with customer</p><p>01 Oct · 15:30 · Assigned to Michael O.</p><p>01 Oct · 14:20 · Request received</p></div><label className="mt-5 block text-xs font-semibold">Internal note<textarea value={note} onChange={(event) => setNote(event.target.value)} className="mt-2 min-h-28 w-full rounded-lg border border-slate-200 p-3 text-xs font-normal" /></label><button type="button" onClick={() => setMessage("Internal note added in this demo session.")} className="mt-4 rounded-lg border border-slate-200 px-4 py-3 text-xs font-semibold text-indigo-900">Add note</button></Card>
      </div>
      <div className="space-y-5">
        <Card title="Customer"><h3 className="text-xl font-bold">David Shema</h3><p className="mt-5 text-xs">david.shema@example.com</p><p className="mt-5 text-xs">+250 78 555 0184</p><Link href="/operations/customers/c1" className="mt-5 inline-flex rounded-lg border border-slate-200 px-4 py-3 text-xs font-semibold text-indigo-900">View customer</Link></Card>
        <Card title="Assignment &amp; quote"><label className="block text-xs font-semibold">Specialist<select value={specialist} onChange={(event) => setSpecialist(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal"><option>Michael O. · Network engineer</option><option>Abena T. · IT specialist</option><option>Unassigned</option></select></label><label className="mt-4 block text-xs font-semibold">Status<select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal"><option>Scheduled</option><option>Pending</option><option>Assigned</option><option>In progress</option><option>Completed</option></select></label><label className="mt-4 block text-xs font-semibold">Estimated fee<input value={fee} onChange={(event) => setFee(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal" /></label><label className="mt-4 block text-xs font-semibold">Priority<select value={priority} onChange={(event) => setPriority(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal"><option>Normal</option><option>High</option><option>Urgent</option></select></label><button type="button" onClick={() => setMessage("Assignment saved in this demo session.")} className="mt-4 rounded-lg bg-[#10139a] px-4 py-3 text-xs font-semibold text-white">Save assignment</button></Card>
        <aside className="rounded-lg bg-[#efefff] p-4"><p className="text-xs font-bold text-indigo-900">No payment taken</p><p className="mt-2 text-xs text-slate-500">Confirm the scope and quote before starting work.</p></aside>
      </div>
    </div>
  </OperationsShell>;
}
