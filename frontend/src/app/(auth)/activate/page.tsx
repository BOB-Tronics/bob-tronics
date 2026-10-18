"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { activate } from "@/lib/auth";

// Account activation (POST /accounts/activate/ with uid + token).
// UNVERIFIED: the activation email link format is unknown; both ?uid=&token= query
// parameters and manual entry are supported.
function ActivateForm() {
  const searchParams = useSearchParams();
  const [uid, setUid] = useState(searchParams.get("uid") ?? "");
  const [token, setToken] = useState(searchParams.get("token") ?? "");
  const [status, setStatus] = useState<"idle" | "working" | "done">("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function run(nextUid: string, nextToken: string) {
    setStatus("working");
    setError("");
    try {
      const response = await activate({ uid: nextUid, token: nextToken });
      setMessage(response?.message ?? "Your account is now active. You can sign in.");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Activation failed. The link may have expired.");
      setStatus("idle");
    }
  }

  // Links from the activation email carry uid and token, so activate right away.
  useEffect(() => {
    const initialUid = searchParams.get("uid");
    const initialToken = searchParams.get("token");
    if (initialUid && initialToken) void run(initialUid, initialToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(uid, token);
  }

  if (status === "done") {
    return (
      <Card className="text-center">
        <h1 className="text-2xl font-bold text-ink">Account activated</h1>
        <p className="mt-3 text-muted">{message}</p>
        <Button href="/sign-in" className="mt-6">
          Sign in
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <h1 className="text-2xl font-bold text-ink">Activate your account</h1>
      <p className="mt-2 text-muted">Use the link from your activation email, or paste its details below.</p>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <Input label="User ID (uid)" name="uid" required value={uid} onChange={(event) => setUid(event.target.value)} />
        <Input label="Activation token" name="token" required value={token} onChange={(event) => setToken(event.target.value)} />
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <Button type="submit" loading={status === "working"}>
          Activate account
        </Button>
      </form>
      <p className="mt-5 text-sm text-muted">
        Already active?{" "}
        <Link href="/sign-in" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </Card>
  );
}

export default function ActivatePage() {
  return (
    <div className="auth-background flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <Suspense fallback={<Card>Loading...</Card>}>
          <ActivateForm />
        </Suspense>
      </div>
    </div>
  );
}
