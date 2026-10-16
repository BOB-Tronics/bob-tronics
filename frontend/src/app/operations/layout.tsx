"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import OperationsFrame from "@/components/operations/OperationsFrame";

export default function OperationsLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("bob_access_token");
    if (!token || token === "mock-access-token") {
      // Require valid authentication token for admin operations
      router.push("/sign-in");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <p className="text-sm font-medium">Verifying security credentials...</p>
      </div>
    );
  }

  return <OperationsFrame>{children}</OperationsFrame>;
}
