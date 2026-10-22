"use client";

import { useCallback, useEffect, useState } from "react";
import OperationsShell from "@/components/operations/OperationsShell";
import { ApiError } from "@/lib/api";
import {
  deleteContactMessage,
  getContactMessage,
  listContactMessages,
  patchContactMessage,
  replaceContactMessage,
  type ContactMessage,
  type ContactMessageUpdate,
} from "@/services/contact";

const buttonClass = "rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-indigo-900 hover:bg-slate-50 disabled:opacity-50";

function contactErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) return "Please sign in to view or manage contact messages.";
    if (error.status === 403) return "You do not have permission to manage contact messages.";
    if (error.status === 404) return "That contact message could not be found.";
    if (error.status === 400) return "Please check the message fields and try again.";
  }
  return "Something went wrong. Please try again.";
}

export default function OperationsContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [form, setForm] = useState<ContactMessageUpdate>({});

  const load = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError("");
    try {
      const result = await listContactMessages();
      setMessages(result.results);
      setCount(result.count);
    } catch (err: unknown) {
      setError(contactErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void load(false);
    };
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void load(false);
    }, 30000);
    return () => {
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      window.clearInterval(interval);
    };
  }, [load]);

  async function openMessage(id: number, edit = false) {
    setActionError("");
    try {
      const detail = await getContactMessage(id);
      setSelected(detail);
      setForm({ name: detail.name, email: detail.email, phone: detail.phone, subject: detail.subject, message: detail.message, status: detail.status });
      setEditing(edit);
    } catch (err: unknown) {
      setActionError(contactErrorMessage(err));
    }
  }

  function updateField(field: keyof ContactMessageUpdate, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function saveMessage(method: "PUT" | "PATCH") {
    if (!selected) return;
    setSaving(true);
    setActionError("");
    try {
      if (method === "PUT") await replaceContactMessage(selected.id, form);
      else await patchContactMessage(selected.id, form);
      setEditing(false);
      setSelected(null);
      await load();
    } catch (err: unknown) {
      setActionError(contactErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function removeMessage(message: ContactMessage) {
    if (!window.confirm(`Delete the contact message from ${message.name || message.email}?`)) return;
    setActionError("");
    try {
      await deleteContactMessage(message.id);
      if (selected?.id === message.id) setSelected(null);
      await load();
    } catch (err: unknown) {
      setActionError(contactErrorMessage(err));
    }
  }

  const received = (value: string) => value ? new Date(value).toLocaleString() : "\u2014";

  return (
    <OperationsShell active="Contact">
      <p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Contact</p>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Contact messages</h1>
          <p className="mt-2 text-sm text-slate-500">Review messages sent through the contact page.</p>
        </div>
        <span className="rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-indigo-900">{count} messages</span>
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl bg-white p-5 shadow-card sm:p-6">
        {error && <p role="alert" className="mb-4 text-sm text-rose-700">{error}<button type="button" onClick={() => void load()} className="ml-3 underline">Retry</button></p>}
        {actionError && <p role="alert" className="mb-4 text-sm text-rose-700">{actionError}</p>}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="bg-slate-50 text-[10px] text-slate-500">
              <tr>{["Sender", "Email", "Subject", "Received", "Status", "Actions"].map((label) => <th key={label} className="px-3 py-3.5 font-semibold">{label}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500">Loading contact messages...</td></tr>
                : messages.length === 0 ? <tr><td colSpan={6} className="px-4 py-12 text-center"><p className="text-sm font-semibold text-slate-800">No contact messages yet</p></td></tr>
                  : messages.map((message) => <tr key={message.id} className="border-t border-slate-100">
                    <td className="px-3 py-3 font-semibold text-slate-800">{message.name || "\u2014"}</td>
                    <td className="px-3 py-3 text-slate-600">{message.email || "\u2014"}</td>
                    <td className="px-3 py-3 text-slate-600">{message.subject || "\u2014"}</td>
                    <td className="px-3 py-3 text-slate-600">{received(message.receivedAt)}</td>
                    <td className="px-3 py-3 text-slate-600">{message.status || "\u2014"}</td>
                    <td className="px-3 py-3"><div className="flex flex-wrap gap-1.5">
                      <button type="button" className={buttonClass} onClick={() => void openMessage(message.id)}>View</button>
                      <button type="button" className={buttonClass} onClick={() => void openMessage(message.id, true)}>Edit</button>
                      <button type="button" className={`${buttonClass} text-rose-700`} onClick={() => void removeMessage(message)}>Delete</button>
                    </div></td>
                  </tr>)}
            </tbody>
          </table>
        </div>
      </section>

      {selected && <section className="mt-6 rounded-2xl bg-white p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold">{editing ? "Edit contact message" : "Contact message details"}</h2><button type="button" className={buttonClass} onClick={() => { setSelected(null); setEditing(false); }}>Close</button></div>
        {editing ? <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {(["name", "email", "phone", "subject"] as const).map((field) => <label key={field} className="text-xs font-semibold capitalize text-slate-600">{field}<input value={form[field] ?? ""} onChange={(event) => updateField(field, event.target.value)} className="mt-1 h-10 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-900" /></label>)}
          <label className="text-xs font-semibold text-slate-600 sm:col-span-2">Message<textarea value={form.message ?? ""} onChange={(event) => updateField("message", event.target.value)} rows={5} className="mt-1 w-full rounded-md border border-slate-200 p-3 text-sm text-slate-900" /></label>
          <label className="text-xs font-semibold text-slate-600">Status<input value={form.status ?? ""} onChange={(event) => updateField("status", event.target.value)} className="mt-1 h-10 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-900" /></label>
          <div className="flex flex-wrap items-end gap-2 sm:col-span-2"><button type="button" disabled={saving} className={buttonClass} onClick={() => void saveMessage("PATCH")}>{saving ? "Saving..." : "Save changes (PATCH)"}</button><button type="button" disabled={saving} className={buttonClass} onClick={() => void saveMessage("PUT")}>Replace message (PUT)</button></div>
        </div> : <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-xs text-slate-500">Sender</dt><dd className="mt-1">{selected.name || "\u2014"}</dd></div><div><dt className="text-xs text-slate-500">Email</dt><dd className="mt-1">{selected.email || "\u2014"}</dd></div><div><dt className="text-xs text-slate-500">Phone</dt><dd className="mt-1">{selected.phone || "\u2014"}</dd></div><div><dt className="text-xs text-slate-500">Received</dt><dd className="mt-1">{received(selected.receivedAt)}</dd></div><div><dt className="text-xs text-slate-500">Subject</dt><dd className="mt-1">{selected.subject || "\u2014"}</dd></div><div><dt className="text-xs text-slate-500">Status</dt><dd className="mt-1">{selected.status || "\u2014"}</dd></div><div className="sm:col-span-2"><dt className="text-xs text-slate-500">Message</dt><dd className="mt-1 whitespace-pre-wrap">{selected.message || "\u2014"}</dd></div></dl>}
      </section>}
    </OperationsShell>
  );
}
