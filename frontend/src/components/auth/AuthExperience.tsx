"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { login, loginWithGoogle, register } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import type { RegisterInput } from "@/types";

type AuthMode = "sign-in" | "sign-up";

type GoogleCredentialResponse = { credential?: string };
type GoogleIdentityApi = {
  accounts: {
    id: {
      initialize(options: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
      }): void;
      renderButton(
        parent: HTMLElement,
        options: {
          theme: "outline";
          size: "large";
          shape: "pill";
          text: "signin_with";
          width: number;
        }
      ): void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentityApi;
  }
}

export default function AuthExperience({ initialMode }: { initialMode: AuthMode }) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [googleScriptFailed, setGoogleScriptFailed] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isSignIn = mode === "sign-in";

  useEffect(() => setMode(initialMode), [initialMode]);

  const handleGoogleCredential = useCallback(async (response: GoogleCredentialResponse) => {
    if (!response.credential) {
      setError("Google did not return a sign-in credential. Please try again.");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      const user = await loginWithGoogle(response.credential);
      router.push(user.role === "super_admin" ? "/operations/dashboard" : "/account");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        const data = err.data as { details?: Record<string, string[]> } | undefined;
        const details = data?.details;
        if (details) {
          const messages = Object.values(details).flat();
          setError(messages[0] ?? "Google sign-in failed. Please try again.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const initializeGoogleButton = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const container = googleButtonRef.current;
    if (!clientId || !container || !window.google) return;

    container.replaceChildren();
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => { void handleGoogleCredential(response); },
    });
    window.google.accounts.id.renderButton(container, {
      theme: "outline",
      size: "large",
      shape: "pill",
      text: "signin_with",
      width: Math.max(200, Math.floor(container.getBoundingClientRect().width)),
    });
  }, [handleGoogleCredential]);

  useEffect(() => {
    initializeGoogleButton();
  }, [initializeGoogleButton, isSignIn]);

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
    <section className={`flex items-center justify-center bg-[#dfe6fb] px-6 sm:px-10 md:min-h-[500px] md:px-9 lg:px-12 ${isSignIn ? "py-10" : "py-4"}`} aria-labelledby="auth-title">
      <div className="w-full max-w-md">
        <Link href="/" aria-label="BOB TRONICS home" className={`mx-auto ${isSignIn ? "mb-4" : "mb-1"} block w-fit rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary`}>
          <Image src="/images/logo.png" alt="BOB TRONICS" width={isSignIn ? 64 : 44} height={isSignIn ? 64 : 44} priority />
        </Link>
        <h1 id="auth-title" className="text-center text-2xl font-bold text-[#080D28] sm:text-3xl">{isSignIn ? "Sign In" : "Create Account"}</h1>
        {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
          <>
            <div ref={googleButtonRef} className={`${isSignIn ? "mt-5 h-10" : "mt-2 h-8"} flex w-full items-center justify-center`} />
            <Script
              src="https://accounts.google.com/gsi/client"
              strategy="afterInteractive"
              onReady={initializeGoogleButton}
              onError={() => setGoogleScriptFailed(true)}
            />
            {googleScriptFailed && <p role="status" className="text-center text-xs text-red-600">Google sign-in could not load. Please try again later.</p>}
          </>
        ) : (
          <p role="status" className="mt-3 text-center text-xs text-red-600">Google sign-in is not configured.</p>
        )}
        <p className={`text-center text-xs font-semibold text-[#414963] ${isSignIn ? "my-3" : "my-1"}`}>{isSignIn ? "Sign in with Email & Password" : "Register with E-mail"}</p>
        <form onSubmit={submit} className={isSignIn ? "space-y-3" : "space-y-1.5 [&_input]:h-9 [&_input]:text-sm"}>
          {!isSignIn && (
            <>
              <div className="grid grid-cols-2 gap-2">
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
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="auth-phone" className="sr-only">Phone</label>
                <input id="auth-phone" name="phone" type="tel" autoComplete="tel" required placeholder="Phone" className="h-12 w-full rounded-full border-0 bg-[#F0F0F0] px-4 text-sm text-ink placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" />
                {fieldErrors.phone && <p role="status" className="text-xs text-red-600">{fieldErrors.phone}</p>}
              </div>
              <div>
                <label htmlFor="auth-residence" className="sr-only">Residence</label>
                <input id="auth-residence" name="residence" type="text" autoComplete="address-level2" required placeholder="Residence" className="h-12 w-full rounded-full border-0 bg-[#F0F0F0] px-4 text-sm text-ink placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" />
                {fieldErrors.residence && <p role="status" className="text-xs text-red-600">{fieldErrors.residence}</p>}
              </div>
            </div>
          )}
          <div className={isSignIn ? "space-y-3" : "space-y-1"}>
          <div>
            <label htmlFor="auth-email" className="sr-only">Email</label>
            <input id="auth-email" name="email" type="email" autoComplete="email" required placeholder="Enter your email" className="h-12 w-full rounded-full border-0 bg-[#F0F0F0] px-4 text-sm text-ink placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" />
            {fieldErrors.email && <p role="status" className="text-xs text-red-600">{fieldErrors.email}</p>}
          </div>
          <div className="relative"><label htmlFor="auth-password" className="sr-only">Password</label><input id="auth-password" name="password" type={passwordVisible ? "text" : "password"} autoComplete={isSignIn ? "current-password" : "new-password"} minLength={8} required placeholder="Enter password" className="h-12 w-full rounded-full border-0 bg-[#F0F0F0] px-4 pr-12 text-sm text-ink placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" /><button type="button" onClick={() => setPasswordVisible((visible) => !visible)} aria-label={passwordVisible ? "Hide password" : "Show password"} aria-pressed={passwordVisible} className="absolute inset-y-0 right-3 flex items-center text-[#414963] hover:text-primary"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{passwordVisible ? <><path d="M3 3l18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.3 4.5 9 7-.3 1.2-1 2.4-2 3.4" /><path d="M6.2 6.2C4 7.5 2.5 9.7 2 12c.7 2.5 4 7 10 7 1.1 0 2.1-.2 3-.5" /></> : <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>}</svg></button>
            {fieldErrors.password && <p role="status" className="text-xs text-red-600">{fieldErrors.password}</p>}
          </div>
          </div>
          {isSignIn && (
            <p className="text-right text-xs">
              <Link href="/forgot-password" className="font-semibold text-[#414963] hover:text-primary hover:underline">Forgot password?</Link>
            </p>
          )}
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
          {error && <p role="status" className="text-center text-xs text-red-600">{error}</p>}
          {message && <p role="status" className="text-center text-xs text-[#414963]">{message}</p>}
          <div className={`${isSignIn ? "pt-3" : "pt-1"} text-center`}><button type="submit" disabled={isLoading} className={`min-w-36 rounded-full bg-[#100578] px-8 ${isSignIn ? "py-2.5" : "py-2"} text-xs font-semibold uppercase text-white transition hover:bg-primary-dark disabled:opacity-60`}>{isLoading ? "Please wait..." : isSignIn ? "Sign In" : "Sign Up"}</button></div>
        </form>
        <p className={`text-center text-[10px] leading-relaxed text-[#59617a] ${isSignIn ? "mt-4" : "mt-2"}`}>{isSignIn ? "By signing in, you agree to our Terms of Service and Privacy Policy." : "By creating an account, you agree to our Terms of Service and Privacy Policy."}</p>
      </div>
    </section>
  );

  const welcomePanel = (
    <section className="auth-welcome-panel flex min-h-[220px] items-center justify-center px-8 py-10 text-center text-white shadow-[0_16px_28px_rgba(0,0,0,0.28)] md:min-h-[470px] md:px-10" aria-live="polite">
      <div className="max-w-sm"><h2 className="text-2xl font-semibold leading-tight sm:text-3xl">{isSignIn ? <>Welcome To<br />BOB TRONICS!</> : "Welcome back!"}</h2><p className="mt-3 text-xs font-medium text-white/80">{isSignIn ? "Sign up now and enjoy our site" : "Sign in with Email & Password"}</p><button type="button" onClick={() => switchMode(isSignIn ? "sign-up" : "sign-in")} className="mt-5 min-w-36 rounded-full border border-white/80 px-6 py-2 text-xs font-semibold uppercase text-white transition hover:bg-white hover:text-[#080542]">{isSignIn ? "Sign Up" : "Sign In"}</button></div>
    </section>
  );

  return <div className="auth-background flex min-h-screen items-center justify-center p-4 sm:p-8"><div className="w-full max-w-5xl overflow-hidden rounded-xl shadow-[0_24px_48px_rgba(10,15,40,0.22)]"><div className="grid items-stretch md:grid-cols-2">{isSignIn ? <>{formPanel}{welcomePanel}</> : <>{welcomePanel}{formPanel}</>}</div></div></div>;
}
