"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function DashboardClient() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const t = getAccessToken();
      setToken(t);
      if (!t) {
        router.replace("/sign-in");
      }
      setChecked(true);
    })();
  }, [router]);

  if (!checked) return null;

  if (!token) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#080D28]">Dashboard</h1>
        <p className="mt-2 text-[#4f5872]">
          Welcome back to your BOB TRONICS dashboard. Manage your orders,
          profile, and settings from here.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <h2 className="text-xl font-bold text-[#080D28] mb-4">Your Orders</h2>
          <p className="text-[#4f5872] mb-4">View order history and track shipments.</p>
          <Button href="/account/orders">View Orders</Button>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-[#080D28] mb-4">Profile</h2>
          <p className="text-[#4f5872] mb-4">Update your account information.</p>
          <Button variant="secondary" href="/account/profile">Edit Profile</Button>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-[#080D28] mb-4">Addresses</h2>
          <p className="text-[#4f5872] mb-4">Manage your shipping addresses.</p>
          <Button variant="secondary" href="/account/addresses">Manage Addresses</Button>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <h2 className="text-xl font-bold text-[#080D28] mb-4">Quick Actions</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button fullWidth href="/shop">Browse Products</Button>
            <Button variant="secondary" fullWidth href="/cart">View Cart</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}