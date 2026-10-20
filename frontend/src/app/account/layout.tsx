"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AccountLayoutFrame from "@/components/account/AccountLayoutFrame";
import { ApiError } from "@/lib/api";
import { getAccessToken, getMe } from "@/lib/auth";
import type { BackendUserProfile } from "@/types";

type SessionStatus = "loading" | "ready" | "error";

export default function AccountLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [user, setUser] = useState<BackendUserProfile | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function checkSession() {
      if (!getAccessToken()) {
        router.replace("/sign-in");
        return;
      }

      try {
        const profile = await getMe();
        if (!profile) throw new Error("Missing account profile");
        if (!cancelled) {
          setUser(profile);
          setStatus("ready");
        }
      } catch (error: unknown) {
        if (cancelled) return;
        if (error instanceof ApiError && error.status === 401) {
          router.replace("/sign-in");
          return;
        }
        setStatus("error");
      }
    }

    void checkSession();
    return () => {
      cancelled = true;
    };
  }, [router, attempt]);

  if (status === "loading") return <p>Loading account...</p>;
  if (status === "error") {
    return (
      <div role="alert">
        <p>We could not load your account. Please try again.</p>
        <button type="button" onClick={() => { setStatus("loading"); setAttempt((value) => value + 1); }}>Retry</button>
      </div>
    );
  }
  if (!user) return null;

  return (
    <AccountLayoutFrame
      user={{
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
      }}
    >
      {children}
    </AccountLayoutFrame>
  );
}