"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input, { Select } from "@/components/ui/Input";
import { formatDate, formatPrice } from "@/lib/format";
import type { Order } from "@/types";

export default function AccountPayments({ orders, name, phone }: { orders: Order[]; name: string; phone: string }) {
  const [methodType, setMethodType] = useState<"mobile" | "card">("mobile");
  const [savedMethod, setSavedMethod] = useState(`MTN Mobile Money · ••• ${phone.replace(/\D/g, "").slice(-4)}`);
  const [removed, setRemoved] = useState(false);
  const [mobile, setMobile] = useState("");
  const [accountName, setAccountName] = useState(name);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState(name);
  const [message, setMessage] = useState("");

  function addMethod(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavedMethod(methodType === "mobile" ? `MTN Mobile Money · ••• ${mobile.slice(-4)}` : `Visa · •••• ${cardNumber.replace(/\s/g, "").slice(-4)}`);
    setRemoved(false);
    setMessage("Payment method saved.");
  }

  return <>
    <Card><h2 className="text-lg font-bold">Saved payment methods</h2>{removed ? <p className="mt-5 text-sm text-muted">No saved payment methods.</p> : <div className="mt-5"><div className="flex flex-wrap items-center justify-between gap-3"><p className="font-semibold">{savedMethod}</p><span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">Default</span></div><p className="mt-4 text-sm text-muted">{name} · Phone authorization required for each payment</p><Button variant="secondary" className="mt-4" onClick={() => { setRemoved(true); setMessage("Payment method removed."); }}>Remove method</Button></div>}</Card>
    <Card><h2 className="text-lg font-bold">Add payment method</h2><div className="mt-4 flex gap-2"><button type="button" onClick={() => setMethodType("mobile")} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${methodType === "mobile" ? "border-primary bg-accent text-primary" : "border-line text-muted"}`}>Mobile Money</button><button type="button" onClick={() => setMethodType("card")} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${methodType === "card" ? "border-primary bg-accent text-primary" : "border-line text-muted"}`}>Card</button></div><form onSubmit={addMethod} className="mt-4 space-y-4">{methodType === "mobile" ? <><Select label="Network" name="network" options={["MTN Mobile Money", "Airtel Money"].map((option) => ({ value: option, label: option }))} /><Input label="Phone number" type="tel" required value={mobile} onChange={(event) => setMobile(event.target.value)} placeholder="Enter mobile number" /><Input label="Account name" required value={accountName} onChange={(event) => setAccountName(event.target.value)} /></> : <><Input label="Card number" required inputMode="numeric" value={cardNumber} onChange={(event) => setCardNumber(event.target.value)} placeholder="1234 5678 9012 3456" /><Input label="Name on card" required value={cardName} onChange={(event) => setCardName(event.target.value)} /><div className="grid gap-4 sm:grid-cols-2"><Input label="Expiry date" required placeholder="MM / YY" /><Input label="Security code" required type="password" inputMode="numeric" placeholder="CVV" /></div></>}<Button type="submit">Save payment method</Button>{message && <p role="status" className="text-sm text-success">{message}</p>}</form><div className="mt-5 rounded-lg bg-accent p-4 text-sm"><p className="font-semibold text-primary">Your payment details stay protected</p><p className="mt-1 text-xs text-muted">We never store your Mobile Money PIN or card CVV.</p></div></Card>
    <Card><h2 className="text-lg font-bold">Recent transactions</h2><div className="mt-4 overflow-x-auto rounded-lg border border-line"><table className="w-full min-w-[650px] text-left text-xs"><thead className="bg-slate-100 text-muted"><tr>{["Reference", "Order", "Date", "Amount", "Status"].map((heading) => <th key={heading} className="px-3 py-3 font-medium">{heading}</th>)}</tr></thead><tbody>{orders.slice(0, 2).map((order) => <tr key={order.id} className="border-t border-line"><td className="px-3 py-4 font-semibold">{order.paymentReference || "—"}</td><td className="px-3 py-4">{order.id}</td><td className="px-3 py-4">{formatDate(order.date)}</td><td className="px-3 py-4">{formatPrice(order.total)}</td><td className="px-3 py-4 text-primary">{order.paymentStatus}</td></tr>)}</tbody></table></div></Card>
  </>;
}
