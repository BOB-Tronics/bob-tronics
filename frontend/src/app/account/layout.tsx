import type { ReactNode } from "react";
import AccountLayoutFrame from "@/components/account/AccountLayoutFrame";
import { getCurrentUser } from "@/services/account";

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  return <AccountLayoutFrame user={user}>{children}</AccountLayoutFrame>;
}
