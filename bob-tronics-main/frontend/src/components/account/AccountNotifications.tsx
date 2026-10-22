"use client";

import { useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const initialItems = [
  { title: "Your order is packed", detail: "BT-10482 is ready for courier collection.", meta: "02 Oct · 09:15 · Unread", group: "Orders", unread: true },
  { title: "IT appointment confirmed", detail: "Network & Setup · 06 Oct at 10:00 AM.", meta: "01 Oct · 16:00 · Unread", group: "Services", unread: true },
  { title: "Payment received", detail: "RWF 14,080 for order BT-10482.", meta: "01 Oct · 14:32", group: "Orders", unread: false },
  { title: "Welcome to BOB TRONICS", detail: "Thanks for joining. Your next upgrade starts here.", meta: "01 Oct · 14:00", group: "Offers", unread: false },
];
const tabs = ["All", "Orders", "Services", "Offers"];

export default function AccountNotifications() {
  const [activeTab, setActiveTab] = useState("All");
  const [items, setItems] = useState(initialItems);
  const [saved, setSaved] = useState(false);
  const [preferences, setPreferences] = useState({ email: true, sms: true, reminders: true, offers: false });
  const visible = useMemo(() => items.filter((item) => activeTab === "All" || item.group === activeTab), [items, activeTab]);

  function toggle(key: keyof typeof preferences) {
    setPreferences((current) => ({ ...current, [key]: !current[key] }));
    setSaved(false);
  }

  return <>
    <div className="flex flex-wrap gap-2">{tabs.map((tab) => <button key={tab} type="button" onClick={() => setActiveTab(tab)} aria-pressed={activeTab === tab} className={`rounded-lg border px-3 py-2 text-sm font-medium ${activeTab === tab ? "border-primary bg-accent text-primary" : "border-line bg-white text-muted"}`}>{tab}</button>)}</div>
    <Card><h2 className="text-lg font-bold">Updates for you</h2><div className="mt-4 space-y-3">{visible.map((item) => <article key={item.title} className={`rounded-lg p-4 ${item.unread ? "bg-accent" : "bg-slate-100"}`}><h3 className="text-sm font-semibold">{item.title}</h3><p className="mt-1 text-sm">{item.detail}</p><p className="mt-2 text-xs text-muted">{item.meta}</p></article>)}</div><Button variant="secondary" className="mt-4" onClick={() => setItems((current) => current.map((item) => ({ ...item, unread: false, meta: item.meta.replace(" · Unread", "") })))}>Mark all as read</Button></Card>
    <Card><h2 className="text-lg font-bold">Notification preferences</h2><div className="mt-4 space-y-4 text-sm">{([["email", "Order updates by email"], ["sms", "SMS delivery alerts"], ["reminders", "Service appointment reminders"], ["offers", "Marketing offers"]] as const).map(([key, label]) => <label key={key} className="flex items-center gap-2"><input type="checkbox" checked={preferences[key]} onChange={() => toggle(key)} className="accent-primary" />{label}</label>)}</div><Button className="mt-5" onClick={() => setSaved(true)}>{saved ? "Preferences saved" : "Save preferences"}</Button></Card>
  </>;
}
