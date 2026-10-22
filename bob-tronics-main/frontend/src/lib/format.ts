// Prices are stored as plain numbers in RWF and formatted here only.
export function formatPrice(amount: number): string {
  return `RWF ${amount.toLocaleString("en-US")}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
