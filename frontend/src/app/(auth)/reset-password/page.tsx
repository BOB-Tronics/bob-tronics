"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { passwordResetConfirm } from "@/lib/auth";

// Step 2 of password reset: POST /accounts/password-reset/confirm/ with uid, token and the
// new password. UNVERIFIED: the email link format; ?uid=&token= query parameters are assumed.
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [uid, setUid] = useState(searchParams.get("uid") ?? "");
  const [token, setToken] = useState(searchParams.get("token") ?? "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "working" | "done">("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setStatus("working");
    setError("");
    try {
      const response = await passwordResetConfirm({ uid, token, new_password: password, password_confirm: confirm });
      setMessage(response?.message ?? "Your password has been changed. You can sign in now.");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not reset your password. The link may have expired.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <Card className="text-center">
        <h1 className="text-2xl font-bold text-ink">Password updated</h1>
        <p className="mt-3 text-muted">{message}</p>
        <Button href="/sign-in" className="mt-6">
          Sign in
        </Button>
      </Card>
    );
  }

  const hasLinkDetails = Boolean(searchParams.get("uid") && searchParams.get("token"));

  return (
    <Card>
      <h1 className="text-2xl font-bold text-ink">Choose a new password</h1>
      <p className="mt-2 text-muted">Use the link from your reset email, then enter your new password.</p>
      <form onSubmit={submit} className="mt-5 space-y-4">
        {!hasLinkDetails && (
          <>
            <Input label="User ID (uid)" name="uid" required value={uid} onChange={(event) => setUid(event.target.value)} />
            <Input label="Reset token" name="token" required value={token} onChange={(event) => setToken(event.target.value)} />
          </>
        )}
        <Input
          label="New password"
          name="new_password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          hint="At least 8 characters."
        />
        <Input
          label="Confirm new password"
          name="password_confirm"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
        />
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <Button type="submit" loading={status === "working"}>
          Update password
        </Button>
      </form>
      <p className="mt-5 text-sm text-muted">
        Need a new link?{" "}
        <Link href="/forgot-password" className="font-semibold text-primary hover:underline">
          Request another reset email
        </Link>
      </p>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="auth-background flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <Suspense fallback={<Card>Loading...</Card>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
