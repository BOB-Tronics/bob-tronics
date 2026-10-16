"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OperationsFrame from "@/components/operations/OperationsFrame";
import { getAccessToken, getMe } from "@/lib/auth";

export default function OperationsLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = getAccessToken();
      if (!token) {
        router.replace("/sign-in");
        setChecked(true);
        return;
      }
      try {
        const profile = await getMe();
        if (!cancelled) {
          setIsAdmin(Boolean(profile && (profile.role === "admin" || profile.role === "super_admin")));
        }
      } catch {
        if (!cancelled) router.replace("/sign-in");
      } finally {
        if (!cancelled) setChecked(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!checked) return null;

  if (!isAdmin) {
    router.replace("/account");
    return null;
  }

  return <OperationsFrame>{children}</OperationsFrame>;
}
