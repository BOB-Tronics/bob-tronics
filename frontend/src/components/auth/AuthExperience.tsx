"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

type AuthMode = "sign-in" | "sign-up";

export default function AuthExperience({ initialMode }: { initialMode: AuthMode }) {
  const [message, setMessage] = useState("");
  const isSignIn = initialMode === "sign-in";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(isSignIn ? "Demo sign-in submitted. Authentication is not connected yet." : "Demo account submitted. Registration is not connected yet.");
  }

  return <div className="auth-background flex min-h-[calc(100vh-116px)] items-center justify-center px-4 py-12 sm:px-8 lg:py-[132px]">
    <div className="grid min-h-[620px] w-full max-w-[1120px] overflow-hidden rounded-[26px] bg-[#dfe6fb] md:min-h-[706px] md:grid-cols-2">
      <form onSubmit={submit} className={`flex min-w-0 flex-col items-center justify-center px-6 py-12 sm:px-10 ${isSignIn ? "md:order-1" : "md:order-2"}`}>
        <div className="w-full max-w-[366px] text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#0b1230] sm:text-[42px]">{isSignIn ? "Sign In" : "Create Account"}</h1>
          <button type="button" onClick={() => setMessage("Google sign in is not connected yet.")} className="mt-12 flex h-12 w-full items-center justify-center gap-3 rounded-full bg-white/30 text-sm font-medium text-[#0b1230] transition hover:bg-white/50"><span aria-hidden="true" className="font-extrabold text-[#4285f4]">G</span>Sign In with Google</button>
          <p className="mt-6 text-sm font-semibold text-slate-600">{isSignIn ? "sign in with Email & Password" : "Register with E-mail"}</p>
          <div className="mt-5 space-y-3">{!isSignIn && <label className="sr-only" htmlFor="auth-name">Name</label>}{!isSignIn && <input id="auth-name" name="name" autoComplete="name" required placeholder="Name" className="h-[43px] w-full rounded-full border border-transparent bg-[#f0f0f0] px-4 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-indigo-800" />}<label className="sr-only" htmlFor="auth-email">Email</label><input id="auth-email" name="email" type="email" autoComplete="email" required placeholder="Enter your email" className="h-[43px] w-full rounded-full border border-transparent bg-[#f0f0f0] px-4 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-indigo-800" /><label className="sr-only" htmlFor="auth-password">Password</label><input id="auth-password" name="password" type="password" autoComplete={isSignIn ? "current-password" : "new-password"} required minLength={8} placeholder="Enter password" className="h-[43px] w-full rounded-full border border-transparent bg-[#f0f0f0] px-4 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-indigo-800" /></div>
          <button type="submit" className="mt-12 min-w-[167px] rounded-full bg-[#100078] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#08004f]">{isSignIn ? "SIGN IN" : "SIGN UP"}</button>
          {message && <p role="status" className="mt-5 text-xs text-slate-700">{message}</p>}
        </div>
      </form>
      <section className={`flex min-h-[300px] flex-col items-center justify-center auth-welcome-panel px-8 py-12 text-center text-white shadow-[0_18px_35px_rgba(0,0,0,.34)] md:my-0 ${isSignIn ? "md:order-2 md:rounded-l-[26px]" : "md:order-1 md:rounded-r-[26px]"}`}>
        <div className="max-w-[390px]"><h2 className="text-3xl font-semibold leading-[1.05] tracking-tight sm:text-[40px]">{isSignIn ? <>Welcome To<br />BOB TRONICS!</> : "Welcome back!"}</h2><p className="mt-4 text-sm font-semibold text-white/80">{isSignIn ? "Sign up now and enjoy our site" : "sign in with Email & Password"}</p><Link href={isSignIn ? "/sign-up" : "/sign-in"} className="mt-7 inline-flex min-w-[170px] items-center justify-center rounded-full border border-white px-8 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#080542]">{isSignIn ? "SIGN UP" : "SIGN IN"}</Link></div>
      </section>
    </div>
  </div>;
}


