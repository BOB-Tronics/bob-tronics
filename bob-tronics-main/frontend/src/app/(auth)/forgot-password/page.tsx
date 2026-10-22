"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { passwordReset } from "@/lib/auth";

// Step 1 of password reset: POST /accounts/password-reset/ with the account email.
// UNVERIFIED: response message and whether unknown emails return 200 or 400.
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "working" | "done">("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("working");
    setError("");
    try {
      const response = await passwordReset({ email: email.trim() });
      setMessage(response?.message ?? "If that email is registered, a reset link is on its way.");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not start the reset. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <div className="auth-background flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {status === "done" ? (
          <Card className="text-center">
            <h1 className="text-2xl font-bold text-ink">Check your email</h1>
            <p className="mt-3 text-muted">{message}</p>
            <p className="mt-3 text-sm text-muted">The email contains a link to choose a new password.</p>
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
              />
              {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
              <Button type="submit" loading={status === "working"}>
                Send reset link
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
