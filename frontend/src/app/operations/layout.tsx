"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OperationsFrame from "@/components/operations/OperationsFrame";
import { ApiError } from "@/lib/api";
import { getAccessToken, getMe } from "@/lib/auth";
import type { BackendUserProfile } from "@/types";

type SessionStatus = "loading" | "ready" | "error";

export default function OperationsLayout({ children }: { children: ReactNode }) {
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
          if (profile.role !== "super_admin" && profile.role !== "admin") {
            router.replace("/account");
            return;
          }
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

  if (status === "loading") return <p>Loading operations...</p>;
  if (status === "error") {
    return (
      <div role="alert">
        <p>We could not verify your account. Please try again.</p>
        <button type="button" onClick={() => { setStatus("loading"); setAttempt((value) => value + 1); }}>Retry</button>
      </div>
    );
  }
  if (!user) return null;


  return <OperationsFrame>{children}</OperationsFrame>;
}