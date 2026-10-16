"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { User } from "@/types";

export default function AccountProfile({ user }: { user: User }) {
  const [name, setName] = useState(`${user.firstName} ${user.lastName}`);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [notice, setNotice] = useState("");

  function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("Your profile changes have been saved for this demo session.");
  }

  function updatePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("Password updated for this demo session.");
  }

  return <>
    <Card><h2 className="text-lg font-bold">Personal information</h2><div className="my-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-primary">{user.firstName[0]}{user.lastName[0]}</div><form onSubmit={saveProfile} className="space-y-4"><Input label="Full name" required value={name} onChange={(event) => setName(event.target.value)} /><Input label="Email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /><Input label="Phone" type="tel" required value={phone} onChange={(event) => setPhone(event.target.value)} /><Button type="submit">Save changes</Button></form></Card>
    <Card><h2 className="text-lg font-bold">Security</h2><form onSubmit={updatePassword} className="mt-4 space-y-4"><Input label="Current password" type="password" required defaultValue="demopass123" /><Input label="New password" type="password" required minLength={8} placeholder="Enter new password" hint="At least 8 characters, including a number." /><Input label="Confirm new password" type="password" required minLength={8} placeholder="Enter new password again" /><Button type="submit" variant="secondary">Update password</Button></form><p className="mt-4 text-xs text-muted">Last login · 01 Oct 2026 · Kigali, Rwanda</p>{notice && <p role="status" className="mt-4 text-sm text-success">{notice}</p>}</Card>
  </>;
}
