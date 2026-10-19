"use client";

import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AccountNotifications from "@/components/account/AccountNotifications";
import AccountSupport from "@/components/account/AccountSupport";
import AccountPayments from "@/components/account/AccountPayments";
import AccountProfile from "@/components/account/AccountProfileForm";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { getAddresses, getCurrentUser, getOrders } from "@/services/account";
import type { Address, Order, User } from "@/types";

const sections = ["addresses", "payments", "profile", "notifications", "support"];

// Profile, payments and addresses need the signed-in customer's data, loaded on the client.
export default function AccountSectionPage() {
  const { section } = useParams<{ section: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const needsUser = section === "payments" || section === "profile";
  const needsOrders = section === "payments";
  const needsAddresses = section === "addresses";

  useEffect(() => {
    if (!sections.includes(section)) return;
    let cancelled = false;
    (async () => {
      try {
        const [loadedUser, loadedOrders, loadedAddresses] = await Promise.all([
          needsUser ? getCurrentUser() : Promise.resolve(null),
          needsOrders ? getOrders() : Promise.resolve([] as Order[]),
          needsAddresses ? getAddresses() : Promise.resolve([] as Address[]),
        ]);
        if (cancelled) return;
        setUser(loadedUser);
        setOrders(loadedOrders);
        setAddresses(loadedAddresses);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "We could not load this section.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [section, needsUser, needsOrders, needsAddresses]);

  if (!sections.includes(section)) notFound();
  if (section === "notifications") return <AccountNotifications />;
  if (section === "support") return <AccountSupport />;

  if (loading) {
    return <p className="rounded-2xl border border-line bg-white p-6 text-muted">Loading...</p>;
  }
  if (error) {
    return <EmptyState title="Something went wrong" description={error} />;
  }

  if (section === "payments" && user) {
    return <AccountPayments orders={orders} name={`${user.firstName} ${user.lastName}`} phone={user.phone} />;
  }
  if (section === "profile" && user) return <AccountProfile user={user} />;

  return (
    <Card>
      <h2 className="text-lg font-bold">Saved addresses</h2>
      {addresses.length === 0 ? (
        <p className="mt-5 text-muted">No saved address yet. Your residence from sign-up appears here once it is set.</p>
      ) : (
        <ul className="mt-5 space-y-4">
          {addresses.map((address) => (
            <li key={address.id} className="rounded-xl border border-line p-4">
              <p className="font-semibold text-ink">
                {address.label} · {address.recipient}
                {address.isDefault && <span className="ml-2 text-xs font-medium text-primary">Default</span>}
              </p>
              <p className="mt-1 text-muted">{[address.street, address.city, address.code].filter(Boolean).join(" · ")}</p>
              <p className="text-muted">{address.phone}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
