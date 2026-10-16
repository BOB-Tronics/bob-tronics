"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { login, register } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import type { RegisterInput } from "@/types";

type AuthMode = "sign-in" | "sign-up";

export default function AuthExperience({ initialMode }: { initialMode: AuthMode }) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isSignIn = mode === "sign-in";

  useEffect(() => setMode(initialMode), [initialMode]);

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setMessage("");
    setError("");
    router.push(`/${nextMode}`);
  }

  function setFieldError(field: string, msg: string) {
    setError(msg);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = (formData.get("email") ?? "").toString();
    const password = (formData.get("password") ?? "").toString();

    try {
      if (isSignIn) {
        const response = await login(email, password);
        router.push(response.user.role === "super_admin" ? "/operations/dashboard" : "/account");
        return;
      }

      const first_name = (formData.get("first_name") ?? "").toString().trim();
      const last_name = (formData.get("last_name") ?? "").toString().trim();
      const password_confirm = (formData.get("password_confirm") ?? "").toString();
      const phone = (formData.get("phone") ?? "").toString().trim();
      const residence = (formData.get("residence") ?? "").toString().trim();
      if (password !== password_confirm) {
        setFieldErrors({ password_confirm: "Passwords do not match" });
        setError("Passwords do not match");
        return;
      }
      const input: RegisterInput = {
        first_name, last_name, email, password, password_confirm, phone, residence,
      };
      await register(input);
      setMessage(
        "Account created. Check your email for activation instructions, then sign in."
      );
      setTimeout(() => switchMode("sign-in"), 1500);
    } catch (err: unknown) {
      const isActivatedError =
        err instanceof Error && /activat/i.test(err.message);
      if (isSignIn && isActivatedError) {
        setError("Your account is not activated. Check your email for the activation link.");
      } else if (err instanceof ApiError) {
        const data = err.data as { details?: Record<string, string[]> } | undefined;
        const details = data?.details;
        if (details) {
          const next: Record<string, string> = {};
          for (const [field, messages] of Object.entries(details)) {
            if (Array.isArray(messages) && messages.length > 0) {
              next[field] = messages[0];
            }
          }
          setFieldErrors(next);
          setError(Object.values(next).join(" "));
          return;
        }
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(isSignIn ? "Sign-in failed. Please try again." : "Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const formPanel = (
    <section className={`flex items-center justify-center bg-[#DEE5FA] px-6 sm:px-12 md:px-10 lg:px-16 ${isSignIn ? "min-h-[590px] py-10" : "min-h-[590px] py-4 md:h-[calc(100vh-12rem)] md:min-h-0 md:py-2"}`} aria-labelledby="auth-title">
      <div className="w-full max-w-md">
        <Link href="/" aria-label="BOB TRONICS home" className={`mx-auto ${isSignIn ? "mb-4" : "mb-2"} block w-fit rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary`}>
          <Image src="/images/logo.png" alt="BOB TRONICS" width={isSignIn ? 64 : 44} height={isSignIn ? 64 : 44} priority />
        </Link>
        <h1 id="auth-title" className="text-center text-3xl font-bold text-[#080D28] sm:text-4xl">{isSignIn ? "Sign In" : "Create Account"}</h1>
        <button type="button" onClick={() => setMessage("Google sign in is not connected yet.")} className={`${isSignIn ? "mt-8 h-12" : "mt-3 h-10"} flex w-full items-center justify-center gap-3 rounded-full bg-white/30 px-4 text-sm font-medium text-[#080D28] transition hover:bg-white/50`}>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Sign In with Google
        </button>
        <p className={`${isSignIn ? "my-5" : "my-2"} text-center text-sm font-semibold text-[#414963]`}>{isSignIn ? "sign in with Email & Password" : "Register with E-mail"}</p>
        <form onSubmit={submit} className={isSignIn ? "space-y-3" : "space-y-1.5 [&_input]:h-10"}>
          {!isSignIn && (
            <>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label htmlFor="auth-first-name" className="sr-only">First name</label>
                  <input id="auth-first-name" name="first_name" type="text" autoComplete="given-name" required placeholder="First name" className="h-12 w-full rounded-full border-0 bg-[#F0F0F0] px-4 text-sm text-ink placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" />
                  {fieldErrors.first_name && <p role="status" className="text-xs text-red-600">{fieldErrors.first_name}</p>}
                </div>
                <div>
                  <label htmlFor="auth-last-name" className="sr-only">Last name</label>
                  <input id="auth-last-name" name="last_name" type="text" autoComplete="family-name" required placeholder="Last name" className="h-12 w-full rounded-full border-0 bg-[#F0F0F0] px-4 text-sm text-ink placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" />
                  {fieldErrors.last_name && <p role="status" className="text-xs text-red-600">{fieldErrors.last_name}</p>}
                </div>
              </div>
            </>
          )}
          {!isSignIn && (
            <>
              <div>
                <label htmlFor="auth-phone" className="sr-only">Phone</label>
                <input id="auth-phone" name="phone" type="tel" autoComplete="tel" required placeholder="Phone" className="h-12 w-full rounded-full border-0 bg-[#F0F0F0] px-4 text-sm text-ink placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" />
                {fieldErrors.phone && <p role="status" className="text-xs text-red-600">{fieldErrors.phone}</p>}
              </div>

            </>
          )}
          <div>
            <label htmlFor="auth-email" className="sr-only">Email</label>
            <input id="auth-email" name="email" type="email" autoComplete="email" required placeholder="Enter your email" className="h-12 w-full rounded-full border-0 bg-[#F0F0F0] px-4 text-sm text-ink placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" />
            {fieldErrors.email && <p role="status" className="text-xs text-red-600">{fieldErrors.email}</p>}
          </div>
          <div className="relative"><label htmlFor="auth-password" className="sr-only">Password</label><input id="auth-password" name="password" type={passwordVisible ? "text" : "password"} autoComplete={isSignIn ? "current-password" : "new-password"} minLength={8} required placeholder="Enter password" className="h-12 w-full rounded-full border-0 bg-[#F0F0F0] px-4 pr-12 text-sm text-ink placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" /><button type="button" onClick={() => setPasswordVisible((visible) => !visible)} aria-label={passwordVisible ? "Hide password" : "Show password"} aria-pressed={passwordVisible} className="absolute inset-y-0 right-3 flex items-center text-[#414963] hover:text-primary"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{passwordVisible ? <><path d="M3 3l18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.3 4.5 9 7-.3 1.2-1 2.4-2 3.4" /><path d="M6.2 6.2C4 7.5 2.5 9.7 2 12c.7 2.5 4 7 10 7 1.1 0 2.1-.2 3-.5" /></> : <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>}</svg></button>
            {fieldErrors.password && <p role="status" className="text-xs text-red-600">{fieldErrors.password}</p>}
          </div>
          {!isSignIn && (
            <div>
              <label htmlFor="auth-password-confirm" className="sr-only">Confirm password</label>
              <div className="relative">
                <input id="auth-password-confirm" name="password_confirm" type={passwordVisible ? "text" : "password"} autoComplete="new-password" minLength={8} required placeholder="Confirm password" className="h-12 w-full rounded-full border-0 bg-[#F0F0F0] px-4 pr-12 text-sm text-ink placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" />
                <button type="button" onClick={() => setPasswordVisible((visible) => !visible)} aria-label={passwordVisible ? "Hide password" : "Show password"} aria-pressed={passwordVisible} className="absolute inset-y-0 right-3 flex items-center text-[#414963] hover:text-primary"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{passwordVisible ? <><path d="M3 3l18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.3 4.5 9 7-.3 1.2-1 2.4-2 3.4" /><path d="M6.2 6.2C4 7.5 2.5 9.7 2 12c.7 2.5 4 7 10 7 1.1 0 2.1-.2 3-.5" /></> : <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>}</svg></button>
              </div>
              {fieldErrors.password_confirm && <p role="status" className="text-xs text-red-600">{fieldErrors.password_confirm}</p>}
            </div>
          )}
          {!isSignIn && (
            <div>
              <label htmlFor="auth-residence" className="sr-only">Residence</label>
              <input id="auth-residence" name="residence" type="text" autoComplete="address-level2" required placeholder="Residence" className="h-12 w-full rounded-full border-0 bg-[#F0F0F0] px-4 text-sm text-ink placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" />
              {fieldErrors.residence && <p role="status" className="text-xs text-red-600">{fieldErrors.residence}</p>}
            </div>
          )}
          {error && <p role="status" className="text-center text-xs text-red-600">{error}</p>}
          {message && <p role="status" className="text-center text-xs text-[#414963]">{message}</p>}
          <div className={isSignIn ? "pt-6 text-center" : "pt-2 text-center"}><button type="submit" disabled={isLoading} className="min-w-40 rounded-full bg-[#100578] px-8 py-3 text-sm font-semibold uppercase text-white transition hover:bg-primary-dark disabled:opacity-60">{isLoading ? "Please wait..." : isSignIn ? "Sign In" : "Sign Up"}</button></div>
        </form>
      </div>
    </section>
  );

  const welcomePanel = (
    <section className="auth-welcome-panel flex min-h-[360px] items-center justify-center rounded-3xl px-8 py-12 text-center text-white shadow-[0_20px_32px_rgba(0,0,0,0.35)] md:min-h-[500px] md:rounded-3xl" aria-live="polite">
      <div className="max-w-sm"><h2 className="text-3xl font-semibold leading-tight sm:text-4xl">{isSignIn ? <>Welcome To<br />BOB TRONICS!</> : "Welcome back!"}</h2><p className="mt-4 text-base font-medium text-white/80">{isSignIn ? "Sign up now and enjoy our site" : "sign in with Email & Password"}</p><button type="button" onClick={() => switchMode(isSignIn ? "sign-up" : "sign-in")} className="mt-8 min-w-44 rounded-full border border-white px-7 py-3 text-sm font-semibold uppercase text-white transition hover:bg-white hover:text-[#080542]">{isSignIn ? "Sign Up" : "Sign In"}</button></div>
    </section>
  );

  return <div className="auth-background flex min-h-screen items-center justify-center p-4 sm:p-6"><div className="w-full lg:w-[65vw] max-w-5xl overflow-hidden rounded-3xl shadow-[0_24px_48px_rgba(10,15,40,0.2)]"><div className="grid md:grid-cols-2">{isSignIn ? <>{formPanel}{welcomePanel}</> : <>{welcomePanel}{formPanel}</>}</div></div></div>;
}
