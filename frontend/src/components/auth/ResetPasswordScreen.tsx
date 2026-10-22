"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { ApiError } from "@/lib/api";
import { clearTokens, confirmPasswordReset } from "@/lib/auth";

type ResetPasswordScreenProps = {
  routeUid?: string;
  routeToken?: string;
};

type ResetFieldErrors = {
  new_password?: string;
  password_confirm?: string;
  token?: string;
  uid?: string;
};

// UNVERIFIED: the backend email template has not been confirmed; the page accepts query and path links.
function fieldErrorsFrom(error: unknown): ResetFieldErrors {
  if (!(error instanceof ApiError) || !error.data || typeof error.data !== "object") return {};
  const body = error.data as {
    error?: { details?: Record<string, unknown> };
    details?: Record<string, unknown>;
  };
  const details = body.error?.details ?? body.details ?? {};
  const getMessage = (value: unknown) => {
    if (Array.isArray(value)) return value.find((item): item is string => typeof item === "string");
    return typeof value === "string" ? value : undefined;
  };
  return {
    new_password: getMessage(details.new_password),
    password_confirm: getMessage(details.password_confirm),
    token: getMessage(details.token),
    uid: getMessage(details.uid),
  };
}

export default function ResetPasswordScreen({ routeUid, routeToken }: ResetPasswordScreenProps) {
  const searchParams = useSearchParams();
  const initialUid = routeUid ?? searchParams.get("uid") ?? searchParams.get("uidb64") ?? "";
  const initialToken = routeToken ?? searchParams.get("token") ?? "";
  const [uid, setUid] = useState(initialUid);
  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [working, setWorking] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [invalidLink, setInvalidLink] = useState(!initialUid || !initialToken);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ResetFieldErrors>({});
  const statusRef = useRef<HTMLElement | null>(null);
  const setStatusRef = (element: HTMLElement | null) => {
    statusRef.current = element;
  };
  const passwordValid = password.length >= 8;
  const passwordsMatch = password.length > 0 && password === confirm;

  useEffect(() => {
    // Keep the reset token in component state only; never leave it in browser history or the address bar.
    window.history.replaceState(window.history.state, "", "/reset-password");
  }, []);

  useEffect(() => {
    if (updated || invalidLink || error) statusRef.current?.focus();
  }, [updated, invalidLink, error]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    if (!uid || !token) {
      setInvalidLink(true);
      return;
    }
    if (!passwordValid) {
      setFieldErrors({ new_password: "Password must be at least 8 characters." });
      return;
    }
    if (!passwordsMatch) {
      setFieldErrors({ password_confirm: "Passwords do not match." });
      return;
    }

    setWorking(true);
    try {
      await confirmPasswordReset({
        uid,
        token,
        new_password: password,
        password_confirm: confirm,
      });
      clearTokens();
      setUpdated(true);
    } catch (requestError) {
      const fields = fieldErrorsFrom(requestError);
      const invalidTokenMessage = `${fields.token ?? ""} ${fields.uid ?? ""}`;
      if (
        (requestError instanceof ApiError && requestError.status === 404) ||
        /invalid|expired/i.test(invalidTokenMessage)
      ) {
        setInvalidLink(true);
      } else if (requestError instanceof ApiError && requestError.status === 429) {
        setError("Too many attempts, please try again later");
      } else if (requestError instanceof ApiError && requestError.status >= 500) {
        setError("Something went wrong. Please try again.");
      } else if (Object.values(fields).some(Boolean)) {
        setFieldErrors(fields);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setWorking(false);
    }
  }

  if (invalidLink) {
    return (
      <Card className="text-center">
        <h1 ref={setStatusRef} tabIndex={-1} aria-live="polite" className="text-2xl font-bold text-ink">This link is invalid or has expired</h1>
        <Button href="/forgot-password" className="mt-6">Request a new link</Button>
      </Card>
    );
  }

  if (updated) {
    return (
      <Card className="text-center">
        <h1 ref={setStatusRef} tabIndex={-1} aria-live="polite" className="text-2xl font-bold text-ink">Password updated</h1>
        <Button href="/sign-in" className="mt-6">Sign in</Button>
      </Card>
    );
  }

  return (
    <Card>
      <h1 className="text-2xl font-bold text-ink">Choose a new password</h1>
      <p className="mt-2 text-muted">Use the link from your reset email, then enter your new password.</p>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <div>
          <Input
            label="New password"
            name="new_password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={fieldErrors.new_password}
          />
          <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-pressed={showPassword} className="mt-1 text-xs font-semibold text-primary underline">
            {showPassword ? "Hide password" : "Show password"}
          </button>
        </div>
        <ul aria-live="polite" className="space-y-1 text-xs text-muted">
          <li>{passwordValid ? "✓" : "○"} At least 8 characters</li>
        </ul>
        <div>
          <Input
            label="Confirm new password"
            name="password_confirm"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            error={fieldErrors.password_confirm}
          />
          <button type="button" onClick={() => setShowConfirm((visible) => !visible)} aria-pressed={showConfirm} className="mt-1 text-xs font-semibold text-primary underline">
            {showConfirm ? "Hide password" : "Show password"}
          </button>
        </div>
        {error && <p ref={setStatusRef} tabIndex={-1} role="alert" aria-live="assertive" className="text-sm text-red-600">{error}</p>}
        {Object.values(fieldErrors).some(Boolean) && <p ref={setStatusRef} tabIndex={-1} role="alert" aria-live="assertive" className="text-sm text-red-600">Please check the highlighted fields.</p>}
        <Button type="submit" loading={working} disabled={!passwordValid || !passwordsMatch}>
          {error ? "Try again" : "Update password"}
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
