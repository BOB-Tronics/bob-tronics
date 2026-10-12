import AccountShell from "@/components/account/AccountShell";
import OrdersList from "@/components/account/OrdersList";
import { getOrders } from "@/services/account";

export const metadata = { title: "Orders · BOB TRONICS" };

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <AccountShell title="Orders">
      <OrdersList orders={orders} />
    </AccountShell>
  );
}
