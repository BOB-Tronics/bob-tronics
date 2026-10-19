"use client";

import { useState, type FormEvent } from "react";
import OperationsShell from "@/components/operations/OperationsShell";
import DemoDataBadge from "@/components/operations/DemoDataBadge";

const tabs = ["General", "Payments", "Delivery", "Team & roles", "Notifications", "Security"];
const initialTeam = [
  { name: "Emmanuel K.", role: "Administrator", status: "Active" },
  { name: "Abena T.", role: "Operations manager", status: "Active" },
  { name: "Daniel A.", role: "Delivery coordinator", status: "Active" },
];

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block text-xs font-semibold">{label}<input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100" /></label>;
}

export default function OperationsSettingsPage() {
  const [tab, setTab] = useState("General");
  const [store, setStore] = useState({ name: "BOB TRONICS", email: "david.shema@example.com", phone: "+250 78 555 0100", address: "Nyarugenge", currency: "RWF", timezone: "Africa/Kigali", language: "English", deliveryFee: "80" });
  const [acceptOrders, setAcceptOrders] = useState(true);
  const [acceptRequests, setAcceptRequests] = useState(true);
  const [confirmOrders, setConfirmOrders] = useState(true);
  const [team, setTeam] = useState(initialTeam);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [saved, setSaved] = useState(false);

  function update(key: keyof typeof store, value: string) {
    setStore((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  function invite() {
    if (!inviteName.trim()) return;
    setTeam((current) => [...current, { name: inviteName.trim(), role: "Team member", status: "Invited" }]);
    setInviteName("");
    setInviteOpen(false);
  }

  return <OperationsShell active="Settings">
    <p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Settings</p>
    <h1 className="mt-2 text-3xl font-extrabold">Settings</h1><DemoDataBadge />
    <p className="mt-2 text-sm text-slate-500">Configure your store, team and operating preferences.</p>
    <div role="tablist" aria-label="Settings sections" className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">{tabs.map((item) => <button key={item} role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className={`shrink-0 rounded-lg border px-3.5 py-2.5 text-xs font-semibold ${tab === item ? "border-[#10139a] bg-[#efefff] text-indigo-900" : "border-transparent bg-white text-slate-500"}`}>{item}</button>)}</div>
    <form onSubmit={save} className="mt-5">
      {tab === "General" && <div className="grid gap-5 xl:grid-cols-[1.65fr_0.9fr]">
        <div className="space-y-5">
          <section className="rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="mb-5 text-lg font-bold">Store information</h2><div className="space-y-4">
            <Field label="Store name" value={store.name} onChange={(value) => update("name", value)} />
            <Field label="Support email" value={store.email} onChange={(value) => update("email", value)} />
            <Field label="Phone" value={store.phone} onChange={(value) => update("phone", value)} />
            <Field label="Store address" value={store.address} onChange={(value) => update("address", value)} />
          </div><div className="mt-4 rounded-lg bg-[#efefff] p-4"><p className="text-sm font-bold text-indigo-900">Demo business details</p><p className="mt-1 text-xs text-slate-500">These store contact fields are illustrative, not verified information.</p></div></section>
          <section className="rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="mb-5 text-lg font-bold">Regional preferences</h2><div className="space-y-4">
            <Field label="Currency" value={store.currency} onChange={(value) => update("currency", value)} />
            <Field label="Timezone" value={store.timezone} onChange={(value) => update("timezone", value)} />
            <Field label="Language" value={store.language} onChange={(value) => update("language", value)} />
            <Field label="Default delivery fee" value={store.deliveryFee} onChange={(value) => update("deliveryFee", value)} />
          </div></section>
          <TeamCard team={team} inviteOpen={inviteOpen} inviteName={inviteName} setInviteOpen={setInviteOpen} setInviteName={setInviteName} invite={invite} />
        </div>
        <div className="space-y-5">
          <section className="rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="mb-4 text-lg font-bold">Store status</h2><span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">Online</span><p className="mt-4 text-xs text-slate-500">Your store is accepting orders.</p><div className="mt-5 space-y-4"><Check label="Accept product orders" checked={acceptOrders} setChecked={setAcceptOrders} /><Check label="Accept IT requests" checked={acceptRequests} setChecked={setAcceptRequests} /><Check label="Send order confirmations" checked={confirmOrders} setChecked={setConfirmOrders} /></div></section>
          <section className="rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="text-lg font-bold">Security</h2><p className="mt-4 text-xs">Two-factor authentication · Enabled</p><p className="mt-4 text-xs">Session timeout · 30 minutes</p><button type="button" onClick={() => setTab("Security")} className="mt-5 rounded-lg border border-slate-200 px-4 py-3 text-xs font-semibold text-indigo-900">Manage security</button></section>
        </div>
      </div>}
      {tab === "Payments" && <section className="rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="text-lg font-bold">Payment preferences</h2><div className="mt-5 space-y-4"><Check label="Accept Mobile Money" checked={acceptOrders} setChecked={setAcceptOrders} /><Check label="Accept card payments" checked={acceptRequests} setChecked={setAcceptRequests} /><Field label="Settlement account" value="•••• 0284" onChange={() => {}} /></div></section>}
      {tab === "Delivery" && <section className="max-w-3xl rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="mb-5 text-lg font-bold">Delivery preferences</h2><Field label="Default delivery fee (RWF)" value={store.deliveryFee} onChange={(value) => update("deliveryFee", value)} /><div className="mt-5 space-y-4"><Check label="Offer standard delivery" checked={acceptOrders} setChecked={setAcceptOrders} /><Check label="Require phone confirmation before dispatch" checked={confirmOrders} setChecked={setConfirmOrders} /></div></section>}
      {tab === "Team & roles" && <TeamCard team={team} inviteOpen={inviteOpen} inviteName={inviteName} setInviteOpen={setInviteOpen} setInviteName={setInviteName} invite={invite} />}
      {tab === "Notifications" && <section className="max-w-3xl rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="mb-5 text-lg font-bold">Notification preferences</h2><div className="space-y-4"><Check label="Order confirmations" checked={confirmOrders} setChecked={setConfirmOrders} /><Check label="Low stock alerts" checked={acceptRequests} setChecked={setAcceptRequests} /><Check label="Payment updates" checked={acceptOrders} setChecked={setAcceptOrders} /></div></section>}
      {tab === "Security" && <section className="max-w-3xl rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="text-lg font-bold">Security</h2><p className="mt-4 text-sm">Two-factor authentication · Enabled</p><p className="mt-3 text-sm">Session timeout · 30 minutes</p><button type="button" className="mt-5 rounded-lg border border-slate-200 px-4 py-3 text-xs font-semibold text-indigo-900">Update security settings</button></section>}
      <div className="mt-5 flex items-center gap-3"><button className="rounded-lg bg-[#10139a] px-5 py-3 text-xs font-semibold text-white">Save settings</button>{saved && <span role="status" className="text-xs font-semibold text-emerald-700">Settings saved in this demo session.</span>}</div>
    </form>
  </OperationsShell>;
}

function Check({ label, checked, setChecked }: { label: string; checked: boolean; setChecked: (value: boolean) => void }) {
  return <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} className="accent-indigo-800" />{label}</label>;
}

function TeamCard({ team, inviteOpen, inviteName, setInviteOpen, setInviteName, invite }: {
  team: { name: string; role: string; status: string }[];
  inviteOpen: boolean;
  inviteName: string;
  setInviteOpen: (value: boolean) => void;
  setInviteName: (value: string) => void;
  invite: () => void;
}) {
  return <section className="rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="mb-5 text-lg font-bold">Team &amp; access</h2><div className="overflow-x-auto rounded-lg border border-slate-200"><table className="w-full min-w-[520px] text-left text-xs"><thead className="bg-slate-50 text-[10px] text-slate-500"><tr>{["Team member", "Role", "Status", "Action"].map((heading) => <th key={heading} className="px-3 py-3.5">{heading}</th>)}</tr></thead><tbody>{team.map((member) => <tr key={member.name} className="border-t border-slate-200"><th className="px-3 py-4">{member.name}</th><td className="px-3 py-4">{member.role}</td><td className="px-3 py-4">{member.status}</td><td className="px-3 py-4 text-indigo-800"><button type="button">Manage</button></td></tr>)}</tbody></table></div>
    {inviteOpen && <div className="mt-4 flex gap-2"><input value={inviteName} onChange={(event) => setInviteName(event.target.value)} placeholder="Team member name" className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 px-3 text-sm" /><button type="button" onClick={invite} className="rounded-lg bg-[#10139a] px-4 text-xs font-semibold text-white">Invite</button></div>}
    <button type="button" onClick={() => setInviteOpen(!inviteOpen)} className="mt-4 rounded-lg border border-slate-200 px-4 py-3 text-xs font-semibold text-indigo-900">Invite team member</button>
  </section>;
}



