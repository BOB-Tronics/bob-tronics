"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { requestPasswordReset } from "@/lib/auth";
import { ApiError } from "@/lib/api";

// Step 1 of password reset: POST /accounts/password-reset/ with the account email.
// UNVERIFIED: successful reset-email delivery cannot be confirmed without a real account.
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "working" | "done">("idle");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((remaining) => Math.max(remaining - 1, 0)), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    if (error) errorRef.current?.focus();
    else if (status === "done") messageRef.current?.focus();
  }, [status, error]);

  function showNeutralSuccess() {
    setError("");
    setEmailError("");
    setCooldown(60);
    setStatus("done");
  }

  function backendEmailError(error: unknown): string {
    if (!(error instanceof ApiError) || !error.data || typeof error.data !== "object") return "";
    const wrapper = error.data as { error?: { details?: Record<string, unknown> }; details?: Record<string, unknown> };
    const value = wrapper.error?.details?.email ?? wrapper.details?.email;
    if (Array.isArray(value)) return value.find((item): item is string => typeof item === "string") ?? "";
    return typeof value === "string" ? value : "";
  }

  async function sendResetLink(isResend = false) {
    setError("");
    setEmailError("");
    if (isResend) setResending(true);
    else setStatus("working");
    try {
      await requestPasswordReset(email.trim());
      showNeutralSuccess();
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 404) {
        showNeutralSuccess();
        return;
      }
      if (requestError instanceof ApiError && requestError.status === 429) {
        setError("Too many attempts, please try again later");
      } else if (requestError instanceof ApiError && requestError.status < 500) {
        const fieldError = backendEmailError(requestError);
        if (fieldError) {
          setEmailError(fieldError);
          setError("Please check the highlighted field below.");
        }
        else setError("Please check the email address and try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      if (!isResend) setStatus("idle");
    } finally {
      if (isResend) setResending(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendResetLink();
  }

  return (
    <div className="auth-background flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {status === "done" ? (
          <Card className="text-center">
            <h1 className="text-2xl font-bold text-ink">Check your email</h1>
            <p ref={messageRef} tabIndex={-1} aria-live="polite" className="mt-3 text-muted">If an account exists for this email, we've sent a reset link.</p>
            <p className="mt-3 text-sm text-muted">The email contains a link to choose a new password.</p>
            {error && <p ref={errorRef} tabIndex={-1} role="alert" aria-live="assertive" className="mt-4 text-sm text-red-600">{error}</p>}
            <Button type="button" variant="secondary" className="mt-6" disabled={cooldown > 0 || resending} loading={resending} onClick={() => void sendResetLink(true)}>
              {cooldown > 0 ? `Resend (${cooldown}s)` : "Resend reset link"}
            </Button>
            <Button href="/sign-in" variant="secondary" className="mt-6">
              Back to sign in
            </Button>
          </Card>
        ) : (
          <Card>
            <h1 className="text-2xl font-bold text-ink">Forgot your password?</h1>
            <p className="mt-2 text-muted">Enter your account email and we will send you a reset link.</p>
            <form onSubmit={submit} className="mt-5 space-y-4">
              <Input
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                error={emailError}
              />
              {emailError && <p ref={messageRef} tabIndex={-1} role="status" aria-live="polite" className="text-sm text-red-600">{emailError}</p>}
              {error && <p ref={errorRef} tabIndex={-1} role="alert" aria-live="assertive" className="text-sm text-red-600">{error}</p>}
              <Button type="submit" loading={status === "working"}>
                {error ? "Try again" : "Send reset link"}
              </Button>
            </form>
            <p className="mt-5 text-sm text-muted">
              Remembered it?{" "}
              <Link href="/sign-in" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
