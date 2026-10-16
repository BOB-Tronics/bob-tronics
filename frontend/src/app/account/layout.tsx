"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AccountLayoutFrame from "@/components/account/AccountLayoutFrame";
import { getAccessToken, getMe } from "@/lib/auth";
import type { BackendUserProfile } from "@/types";

export default function AccountLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState<BackendUserProfile | null>(null);

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
        if (!cancelled && profile) setUser(profile);
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

  return (
    <AccountLayoutFrame
      user={{
        firstName: user?.first_name ?? "",
        lastName: user?.last_name ?? "",
        email: user?.email ?? "",
        phone: user?.phone ?? "",
      }}
    >
      {children}
    </AccountLayoutFrame>
  );
}
