"use client";
import { useState, type FormEvent } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ApiError } from "@/lib/api";
import { changePassword, updateProfile } from "@/services/account";
import type { User } from "@/types";

function errorsFrom(error: unknown): Record<string,string> {
  if (!(error instanceof ApiError) || typeof error.data !== "object" || !error.data) return {};
  const data=error.data as Record<string,unknown>; const details=(data.details??(data.error as Record<string,unknown>|undefined)?.details??data) as Record<string,unknown>;
  return Object.fromEntries(Object.entries(details).flatMap(([key,value])=>{const message=typeof value==="string"?value:Array.isArray(value)&&typeof value[0]==="string"?value[0]:null;return message?[[key,message]]:[]}));
}

// Invalid-value live probes confirmed field errors; successful profile/password changes remain unverified.
export default function AccountProfileForm({user}:{user:User}) {
 const [firstName,setFirstName]=useState(user.firstName),[lastName,setLastName]=useState(user.lastName),[phone,setPhone]=useState(user.phone),[residence,setResidence]=useState(user.residence??"");
 const [profileErrors,setProfileErrors]=useState<Record<string,string>>({}),[passwordErrors,setPasswordErrors]=useState<Record<string,string>>({}),[error,setError]=useState(""),[notice,setNotice]=useState(""),[saving,setSaving]=useState(false),[passwordSaving,setPasswordSaving]=useState(false);
 async function saveProfile(event:FormEvent<HTMLFormElement>){event.preventDefault();setSaving(true);setError("");setNotice("");setProfileErrors({});try{await updateProfile({first_name:firstName,last_name:lastName,phone,residence});setNotice("Profile updated successfully.")}catch(e){setProfileErrors(errorsFrom(e));setError(e instanceof ApiError&&e.status===400?"Please check the highlighted fields.":"Profile could not be updated. Please try again.")}finally{setSaving(false)}}
 async function savePassword(event:FormEvent<HTMLFormElement>){event.preventDefault();setPasswordSaving(true);setError("");setNotice("");setPasswordErrors({});const form=new FormData(event.currentTarget);try{await changePassword({current_password:String(form.get("current_password")??""),new_password:String(form.get("new_password")??""),password_confirm:String(form.get("password_confirm")??"")});event.currentTarget.reset();setNotice("Password changed successfully.")}catch(e){setPasswordErrors(errorsFrom(e));setError(e instanceof ApiError&&e.status===400?"Please check the highlighted fields.":"Password could not be changed. Please try again.")}finally{setPasswordSaving(false)}}
 return <><Card><h2 className="text-lg font-bold">Personal information</h2><form onSubmit={saveProfile} className="mt-5 space-y-4"><Input label="First name" name="first_name" required value={firstName} error={profileErrors.first_name} onChange={e=>setFirstName(e.target.value)}/><Input label="Last name" name="last_name" required value={lastName} error={profileErrors.last_name} onChange={e=>setLastName(e.target.value)}/><Input label="Email" type="email" value={user.email} readOnly/><Input label="Phone" name="phone" type="tel" required value={phone} error={profileErrors.phone} onChange={e=>setPhone(e.target.value)}/><Input label="Residence" name="residence" required value={residence} error={profileErrors.residence} onChange={e=>setResidence(e.target.value)}/><Button type="submit" loading={saving}>Save changes</Button></form></Card><Card><h2 className="text-lg font-bold">Security</h2><form onSubmit={savePassword} className="mt-4 space-y-4"><Input label="Current password" name="current_password" type="password" required autoComplete="current-password" error={passwordErrors.current_password}/><Input label="New password" name="new_password" type="password" required minLength={8} autoComplete="new-password" error={passwordErrors.new_password}/><Input label="Confirm new password" name="password_confirm" type="password" required minLength={8} autoComplete="new-password" error={passwordErrors.password_confirm}/><Button type="submit" variant="secondary" loading={passwordSaving}>Update password</Button></form>{error&&<p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}{notice&&<p role="status" className="mt-4 text-sm text-success">{notice}</p>}</Card></>;
}
