"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { loginUser, registerUser } from "@/services/account";

type AuthMode = "sign-in" | "sign-up";

export default function AuthExperience({ initialMode }: { initialMode: AuthMode }) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isSignIn = mode === "sign-in";

  useEffect(() => setMode(initialMode), [initialMode]);

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setMessage("");
    router.push(`/${nextMode}`);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    try {
      if (isSignIn) {
        const data = await loginUser({ email, password });
        if (data?.access) {
          localStorage.setItem("bob_access_token", data.access);
          if (data.refresh) {
            localStorage.setItem("bob_refresh_token", data.refresh);
          }
        }
        setMessage("Sign in successful! Redirecting...");
        router.refresh();
        router.push("/operations/dashboard");
      } else {
        const [first_name, ...lastNameParts] = (name || "").trim().split(" ");
        const last_name = lastNameParts.join(" ");
        const username = email.split("@")[0] + Math.floor(Math.random() * 1000);
        await registerUser({ username, email, password, first_name, last_name });
        setMessage("Account created successfully! Please sign in.");
        setTimeout(() => switchMode("sign-in"), 1000);
      }
    } catch (error: any) {
      console.error("Erro detalhado no login:", error);
      setMessage(error?.message ?? "Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  const formPanel = (
    <section className="flex min-h-[590px] items-center justify-center bg-[#DEE5FA] px-6 py-10 sm:px-12 md:px-10 lg:px-16" aria-labelledby="auth-title">
      <div className="w-full max-w-md">
        <Link href="/" aria-label="BOB TRONICS home" className="mx-auto mb-4 block w-fit rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
          <Image src="/images/logo.png" alt="BOB TRONICS" width={64} height={64} priority />
        </Link>
        <h1 id="auth-title" className="text-center text-3xl font-bold text-[#080D28] sm:text-4xl">{isSignIn ? "Sign In" : "Create Account"}</h1>
        <button type="button" onClick={() => setMessage("Google sign in is not connected yet.")} className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-full bg-white/30 px-4 text-sm font-medium text-[#080D28] transition hover:bg-white/50">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Sign In with Google
        </button>
        <p className="my-5 text-center text-sm font-semibold text-[#414963]">{isSignIn ? "sign in with Email & Password" : "Register with E-mail"}</p>
        <form onSubmit={submit} className="space-y-3">
          {!isSignIn && <div><label htmlFor="auth-name" className="sr-only">Name</label><input id="auth-name" name="name" type="text" autoComplete="name" required placeholder="Name" className="h-12 w-full rounded-full border-0 bg-[#F0F0F0] px-4 text-sm text-ink placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" /></div>}
          <div><label htmlFor="auth-email" className="sr-only">Email</label><input id="auth-email" name="email" type="email" autoComplete="email" required placeholder="Enter your email" className="h-12 w-full rounded-full border-0 bg-[#F0F0F0] px-4 text-sm text-ink placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" /></div>
          <div className="relative"><label htmlFor="auth-password" className="sr-only">Password</label><input id="auth-password" name="password" type={passwordVisible ? "text" : "password"} autoComplete={isSignIn ? "current-password" : "new-password"} minLength={8} required placeholder="Enter password" className="h-12 w-full rounded-full border-0 bg-[#F0F0F0] px-4 pr-12 text-sm text-ink placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" /><button type="button" onClick={() => setPasswordVisible((visible) => !visible)} aria-label={passwordVisible ? "Hide password" : "Show password"} aria-pressed={passwordVisible} className="absolute inset-y-0 right-3 flex items-center text-[#414963] hover:text-primary"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{passwordVisible ? <><path d="M3 3l18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.3 4.5 9 7-.3 1.2-1 2.4-2 3.4" /><path d="M6.2 6.2C4 7.5 2.5 9.7 2 12c.7 2.5 4 7 10 7 1.1 0 2.1-.2 3-.5" /></> : <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>}</svg></button></div>
          {message && <p role="status" className="text-center text-xs text-[#414963]">{message}</p>}
          <div className="pt-6 text-center"><button type="submit" disabled={isLoading} className="min-w-40 rounded-full bg-[#100578] px-8 py-3 text-sm font-semibold uppercase text-white transition hover:bg-primary-dark disabled:opacity-60">{isLoading ? "Please wait…" : isSignIn ? "Sign In" : "Sign Up"}</button></div>
        </form>
      </div>
    </section>
  );

  const welcomePanel = (
    <section className="auth-welcome-panel flex min-h-[360px] items-center justify-center rounded-3xl px-8 py-12 text-center text-white shadow-[0_20px_32px_rgba(0,0,0,0.35)] md:min-h-[590px] md:rounded-3xl" aria-live="polite">
      <div className="max-w-sm"><h2 className="text-3xl font-semibold leading-tight sm:text-4xl">{isSignIn ? <>Welcome To<br />BOB TRONICS!</> : "Welcome back!"}</h2><p className="mt-4 text-base font-medium text-white/80">{isSignIn ? "Sign up now and enjoy our site" : "sign in with Email & Password"}</p><button type="button" onClick={() => switchMode(isSignIn ? "sign-up" : "sign-in")} className="mt-8 min-w-44 rounded-full border border-white px-7 py-3 text-sm font-semibold uppercase text-white transition hover:bg-white hover:text-[#080542]">{isSignIn ? "Sign Up" : "Sign In"}</button></div>
    </section>
  );

  return <div className="auth-background flex min-h-screen items-center justify-center p-5 sm:p-8"><div className="w-full lg:w-[70vw] max-w-6xl overflow-hidden rounded-3xl shadow-[0_24px_48px_rgba(10,15,40,0.2)]"><div className="grid md:grid-cols-2">{isSignIn ? <>{formPanel}{welcomePanel}</> : <>{welcomePanel}{formPanel}</>}</div></div></div>;
}

