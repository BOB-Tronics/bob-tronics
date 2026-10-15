"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input, { Select } from "@/components/ui/Input";

const inputClass = "w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15";
const buttonClass = "rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50";
const outlineButtonClass = "rounded-lg border border-line bg-white px-5 py-3 text-sm font-semibold text-primary hover:bg-surface";

export default function ServiceRequestForm({
  services,
  submitLabel = "Request a service",
  contactMode = false,
  initialService,
}: {
  services?: string[];
  submitLabel?: string;
  contactMode?: boolean;
  initialService?: string;
}) {
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [step, setStep] = useState(0);
  const [service, setService] = useState(initialService && services?.includes(initialService) ? initialService : services?.find((name) => name === "Network & Setup") ?? services?.[0] ?? "Network & Setup");
  const [name, setName] = useState("David Shema");
  const [email, setEmail] = useState("shema.david@example.com");
  const [phone, setPhone] = useState("+250 78 555 0184");
  const [need, setNeed] = useState("Set up a secure Wi-Fi network for our 8-person office. Router configuration, guest access and reliable coverage across two rooms.");
  const [date, setDate] = useState("2026-10-06T10:00");
  const [location, setLocation] = useState("");
  const [onSite, setOnSite] = useState(true);
  const [consent, setConsent] = useState(true);
  const [attachment, setAttachment] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("10:00 AM");
  const chosenDate = new Date(`${date.slice(0, 10)}T12:00:00`);
  const dateLabel = chosenDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const appointmentLabel = `${dateLabel} · ${appointmentTime}`;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setTimeout(() => setStatus("done"), 500);
  }

  if (services && !contactMode) {
    const stepLabels = ["Choose Service", "Describe Need", "Choose Date", "Submit", "Confirmation"];
    const selectedName = name.trim() || "Ama";
    if (step === 4) return <div className="auth-background -mx-4 px-4 py-8 sm:-mx-6 sm:px-6"><div className="page-container">
      <div className="mb-6 flex flex-wrap gap-2">{stepLabels.map((label, index) => <span key={label} className={`rounded-lg px-4 py-2.5 text-xs font-semibold ${step === index ? "border border-primary bg-accent text-primary" : "bg-white text-muted"}`}>{label}</span>)}</div>
      <Card><div className="flex h-11 w-11 items-center justify-center rounded-full border border-success text-success">✓</div><span className="mt-5 inline-flex rounded-full bg-success-bg px-3 py-1 text-xs font-semibold text-success">Appointment confirmed</span><h2 className="mt-5 text-3xl font-bold">Let’s get your office connected.</h2><p className="mt-4">Your {service} request BT-SR-2041 is confirmed. We’ve emailed the appointment details to {email}.</p><div className="mt-5 grid gap-4 text-sm sm:grid-cols-3"><div><p className="text-muted">Service</p><p className="mt-2 font-semibold">{service}</p></div><div><p className="text-muted">Appointment</p><p className="mt-2 font-semibold">{appointmentLabel}</p></div><div><p className="text-muted">Location</p><p className="mt-2 font-semibold">{location || "Kigali, Rwanda"}</p></div></div><div className="mt-5 rounded-lg bg-accent p-4"><p className="font-semibold text-primary">What happens next?</p><p className="mt-1 text-sm text-muted">Our specialist will call before the visit to confirm the scope and quote. No payment has been taken.</p></div><div className="mt-5 flex flex-wrap gap-3"><a href="/account/it-requests" className={buttonClass}>View request in my account</a><a href="/it-services" className={outlineButtonClass}>Back to IT Services</a></div></Card>
      <Card className="mt-6"><h2 className="text-lg font-bold">Request summary</h2><p className="mt-4">{need}</p><p className="mt-4 text-sm text-muted">Contact · {name} · {phone} · {email}</p>{attachment && <p className="mt-3 text-sm text-muted">Attachment · {attachment}</p>}</Card>
    </div></div>;

    return <div className="auth-background -mx-4 px-4 py-8 sm:-mx-6 sm:px-6"><div className="page-container">
      <div className="my-6 flex flex-wrap gap-2">{stepLabels.map((label, index) => <button key={label} type="button" onClick={() => index < 4 && setStep(index)} className={`rounded-lg px-4 py-2.5 text-xs font-semibold ${step === index ? "border border-primary bg-accent text-primary" : "bg-white text-muted"}`}>{label}</button>)}</div>
      <div className="grid gap-6 lg:grid-cols-[1.8fr_0.8fr] lg:items-start"><Card>
        {step === 0 && <><h3 className="text-lg font-bold">Choose a service</h3><div className="mt-5 grid gap-3 sm:grid-cols-2">{services.map((item) => <button key={item} type="button" onClick={() => setService(item)} className={`rounded-xl border p-4 text-left ${service === item ? "border-primary bg-accent" : "border-line"}`}><span className="font-semibold">{item}</span><span className="mt-2 block text-sm text-muted">Expert help tailored to your needs.</span></button>)}</div><label className="mt-5 flex items-center gap-2 text-sm"><input type="checkbox" checked={onSite} onChange={(e) => setOnSite(e.target.checked)} className="accent-primary" /> On-site appointment</label><div className="mt-6"><button className={buttonClass} onClick={() => setStep(1)}>Continue →</button></div></>}
        {step === 1 && <><h3 className="text-lg font-bold">Describe Need</h3><div className="mt-5 space-y-4"><Input label="Full name" required value={name} onChange={(e) => setName(e.target.value)} /><Input label="Phone number" required value={phone} onChange={(e) => setPhone(e.target.value)} /><Input label="Email address" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /><Select label="Service" options={services.map((item) => ({ value: item, label: item }))} value={service} onChange={(e) => setService(e.target.value)} /><label className="block text-sm font-semibold">Describe your need *<textarea rows={4} required value={need} onChange={(e) => setNeed(e.target.value)} className={`${inputClass} mt-2`} /></label><Input label="Preferred date" required value={dateLabel} readOnly onClick={() => setStep(2)} /><Input label="Location" required value={location} onChange={(e) => setLocation(e.target.value)} /><div><label className="block text-sm font-semibold">Attachment (optional)<input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setAttachment(e.target.files?.[0]?.name ?? "")} className={`${inputClass} mt-2`} /></label><p className="mt-2 text-xs text-muted">PDF, PNG or JPG ? Maximum 10MB</p></div></div><div className="mt-6"><button className={buttonClass} onClick={() => setStep(2)}>Continue to Choose Date ?</button></div></>}
        {step === 2 && <><h3 className="text-lg font-bold">Choose Date</h3><p className="mt-5 font-semibold">October 2026</p><div className="mt-5 grid grid-cols-7 gap-1.5 text-center text-xs">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <span key={day} className="py-2">{day}</span>)}{[28, 29, 30, ...Array.from({ length: 31 }, (_, i) => i + 1), 1].map((day, index) => { const inMonth = index >= 3 && index <= 33; const selected = inMonth && day === Number(date.slice(8, 10)); return <button key={`${day}-${index}`} type="button" disabled={!inMonth} onClick={() => setDate(`2026-10-${String(day).padStart(2, "0")}T10:00`)} className={`rounded-lg py-3 ${selected ? "bg-primary text-white" : inMonth ? "bg-slate-100 hover:bg-accent" : "bg-slate-50 text-muted"}`}>{day}</button>; })}</div><p className="mt-5 text-sm font-semibold">Available times · {chosenDate.toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "short" })}</p><div className="mt-4 flex flex-wrap gap-2">{["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM"].map((time) => <button key={time} type="button" onClick={() => setAppointmentTime(time)} className={`${appointmentTime === time ? "border border-primary bg-accent text-primary" : "border border-line bg-white text-muted"} rounded-lg px-3 py-2 text-xs font-semibold`}>{time}</button>)}</div><div className="mt-4 flex gap-2">{[true, false].map((onsite) => <button key={String(onsite)} type="button" onClick={() => setOnSite(onsite)} className={`${onSite === onsite ? "border border-primary bg-accent text-primary" : "border border-line bg-white text-muted"} rounded-lg px-3 py-2 text-xs font-semibold`}>{onsite ? "On-site" : "Remote"}</button>)}</div><label className="mt-5 block text-sm font-semibold">Location<input value={location} onChange={(e) => setLocation(e.target.value)} className={`${inputClass} mt-2`} /></label><div className="mt-5"><button className={buttonClass} onClick={() => setStep(3)}>Review request</button></div></>}
        {step === 3 && <><h3 className="text-lg font-bold">Review &amp; Submit</h3><dl className="mt-5 space-y-4 text-sm">{[["Customer", selectedName], ["Contact", `${phone} · ${email}`], ["Service", service], ["Appointment", `${appointmentLabel} · ${onSite ? "On-site" : "Remote"}`], ["Location", location], ["Need", need], ["Attachment", attachment]].map(([label, value]) => <div key={label}><dt className="text-xs text-muted">{label}</dt><dd className="mt-1">{value}</dd></div>)}</dl><label className="mt-5 flex items-center gap-2 text-xs"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="accent-primary" /> I agree to be contacted about this service request.</label><div className="mt-5 flex flex-wrap gap-3"><button className={buttonClass} disabled={!consent} onClick={() => setStep(4)}>Submit request →</button><button className={outlineButtonClass} onClick={() => setStep(2)}>← Edit request</button></div></>}
      </Card><div className="space-y-5"><Card><h3 className="text-lg font-bold">Your selected service</h3><p className="mt-5 text-2xl font-bold">{service}</p><p className="mt-4 text-sm leading-relaxed text-muted">Secure connections. Reliable coverage. An office ready to work.</p><ul className="mt-4 space-y-3 text-xs"><li>✓ Assessment &amp; recommendations</li><li>✓ Router &amp; network configuration</li><li>✓ Guest Wi-Fi &amp; security</li><li>✓ Testing &amp; handover</li></ul></Card><div className="rounded-lg bg-accent p-4 text-sm"><p className="font-semibold text-primary">No surprise costs</p><p className="mt-1 text-muted">We’ll confirm the scope and quote with you before starting work.</p></div><p className="text-xs text-muted">Demo contact: services@bobtronics.example</p></div></div>
    </div></div>;
  }

  if (status === "done") return <Card><p className="text-lg font-semibold text-success">Thank you! We have received your message.</p><p className="mt-2 text-muted">A member of our team will contact you within one business day.</p></Card>;
  return <Card>
    {contactMode && <h2 className="mb-5 text-xl font-bold text-ink">Send us a message</h2>}
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2"><Input label="Full name" name="name" required autoComplete="name" defaultValue={contactMode ? "David Shema" : undefined} /><Input label="Email" name="email" type="email" required autoComplete="email" defaultValue={contactMode ? "david.shema@example.com" : undefined} /></div>
      <Input label="Phone number" name="phone" type="tel" autoComplete="tel" required={!contactMode} defaultValue={contactMode ? "+250 78 555 0184" : undefined} />
      {contactMode ? <Select label="How can we help?" name="service" options={["Product advice", "Order support", "IT services", "Other"].map((s) => ({ value: s, label: s }))} /> : services && <Select label="Service" name="service" options={services.map((s) => ({ value: s, label: s }))} />}
      <div><label htmlFor="message" className="mb-2 block text-sm font-semibold text-ink">{contactMode ? "Message *" : "How can we help?"}</label><textarea id="message" name="message" rows={contactMode ? 5 : 4} required defaultValue={contactMode ? "I’m looking for a laptop for design work. Can your team help me choose the right configuration?" : undefined} className="w-full rounded-lg border border-line bg-white px-4 py-3 text-base text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" /></div>
      {contactMode && <><div><label htmlFor="attachment" className="mb-2 block text-sm font-semibold text-ink">Attachment (optional)</label><input id="attachment" name="attachment" type="file" className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:font-medium file:text-primary" /></div><label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" required className="accent-primary" /> I agree to the <a href="/about" className="text-primary underline">Privacy Policy</a>.</label></>}
      <Button type="submit" size="lg" loading={status === "saving"}>{submitLabel}</Button>{contactMode && <p className="text-xs text-muted">We aim to respond within one business day.</p>}
    </form>
  </Card>;
}

