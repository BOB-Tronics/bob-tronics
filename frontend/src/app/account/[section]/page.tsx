import { notFound } from "next/navigation";
import AccountNotifications from "@/components/account/AccountNotifications";
import AccountSupport from "@/components/account/AccountSupport";
import AccountPayments from "@/components/account/AccountPayments";
import AccountProfile from "@/components/account/AccountProfile";
import Card from "@/components/ui/Card";
import { getAddresses, getCurrentUser, getOrders } from "@/services/account";

const sections = ["addresses", "payments", "profile", "notifications", "support"];

export default async function AccountSectionPage({ params }: PageProps<"/account/[section]">) {
  const { section } = await params;
  if (!sections.includes(section)) notFound();
  if (section === "notifications") return <AccountNotifications />;
  if (section === "support") return <AccountSupport />;
  if (section === "payments") {
    const [user, orders] = await Promise.all([getCurrentUser(), getOrders()]);
    return <AccountPayments orders={orders} name={`${user.firstName} ${user.lastName}`} phone={user.phone} />;
  }
  if (section === "profile") return <AccountProfile user={await getCurrentUser()} />;

  const addresses = await getAddresses();
  return <Card><h2 className="text-lg font-bold">Saved addresses</h2><ul className="mt-5 space-y-4">{addresses.map((address) => <li key={address.id} className="rounded-xl border border-line p-4"><p className="font-semibold text-ink">{address.label} · {address.recipient}{address.isDefault && <span className="ml-2 text-xs font-medium text-primary">Default</span>}</p><p className="mt-1 text-muted">{address.street}, {address.city} · {address.code}</p><p className="text-muted">{address.phone}</p></li>)}</ul></Card>;
}
