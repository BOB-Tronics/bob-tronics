"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input, { Select } from "@/components/ui/Input";

const tickets = [
  ["BT-TK-0184", "Delivery question", "02 Oct 2026", "Open"],
  ["BT-TK-0091", "Setup advice", "13 Sep 2026", "Resolved"],
];

export default function AccountSupport() {
  const [submitted, setSubmitted] = useState(false);
  const [ticket, setTicket] = useState("");
  const [subject, setSubject] = useState("Delivery question · BT-10482");
  const [message, setMessage] = useState("Could you confirm the delivery window for my MacBook?");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTicket("BT-TK-0185");
    setSubmitted(true);
  }

  return <>
    <Card><h2 className="text-lg font-bold">How can we help?</h2>{submitted ? <div className="mt-5 rounded-lg bg-accent p-4"><p className="font-semibold text-primary">Support ticket {ticket} submitted</p><p className="mt-1 text-sm text-muted">Our team will follow up by email. You can review it in your ticket list below.</p></div> : <form onSubmit={submit} className="mt-4 space-y-4"><Input label="Subject" required value={subject} onChange={(event) => setSubject(event.target.value)} /><Select label="Related order or request" name="related" options={[{ value: "BT-10482", label: "BT-10482" }, { value: "BT-SR-2041", label: "BT-SR-2041" }, { value: "other", label: "Other" }]} /><label className="block text-sm font-semibold">Message<textarea rows={5} required value={message} onChange={(event) => setMessage(event.target.value)} className="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" /></label><div><label htmlFor="support-attachment" className="mb-2 block text-sm font-semibold">Attachment (optional)</label><input id="support-attachment" type="file" accept=".pdf,.jpg,.jpeg,.png" className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:font-medium file:text-primary" /><p className="mt-2 text-xs text-muted">PDF, JPG, PNG · Max 10MB</p></div><Button type="submit">Submit support ticket</Button></form>}</Card>
    <Card><h2 className="text-lg font-bold">Your support tickets</h2><div className="mt-4 overflow-x-auto rounded-lg border border-line"><table className="w-full min-w-[620px] text-left text-xs"><thead className="bg-slate-100 text-muted"><tr>{["Ticket", "Subject", "Updated", "Status", "Action"].map((label) => <th key={label} className="px-3 py-3 font-medium">{label}</th>)}</tr></thead><tbody>{[...tickets, ...(ticket ? [[ticket, subject.split(" · ")[0], "02 Oct 2026", "Open"]] : [])].map(([id, title, updated, status]) => <tr key={id} className="border-t border-line"><td className="px-3 py-4 font-semibold">{id}</td><td className="px-3 py-4">{title}</td><td className="px-3 py-4">{updated}</td><td className="px-3 py-4">{status}</td><td className="px-3 py-4"><button type="button" onClick={() => { setSubject(title); setMessage(`Following up about ${id}.`); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="font-medium text-primary hover:underline">View ticket</button></td></tr>)}</tbody></table></div></Card>
    <div className="rounded-lg bg-accent p-4 text-sm"><p className="font-semibold text-primary">Need faster help?</p><p className="mt-1 text-xs text-muted">Demo support: support@bobtronics.example · +233 30 555 0100 · Mon–Sat, 9AM–6PM</p></div>
  </>;
}
