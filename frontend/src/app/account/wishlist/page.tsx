import AccountShell from "@/components/account/AccountShell";
import WishlistGrid from "@/components/account/WishlistGrid";

export const metadata = { title: "Wishlist · BOB TRONICS" };

export default function WishlistPage() {
  return (
    <AccountShell title="Wishlist">
      <WishlistGrid />
    </AccountShell>
  );
}
