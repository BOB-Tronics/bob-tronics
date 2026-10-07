import type { CartItem, Product } from "@/types";

export const DELIVERY_FEE = 80;

// Promo codes accepted by the demo store. The backend will own this later.
const promoCodes: Record<string, number> = {
  WELCOME500: 500,
};

export function getDiscount(code: string | null): number {
  if (!code) return 0;
  return promoCodes[code.toUpperCase()] ?? 0;
}

export function isValidPromo(code: string): boolean {
  return code.toUpperCase() in promoCodes;
}

export interface CartLine {
  item: CartItem;
  product: Product;
  lineTotal: number;
}

// Joins cart items with their product details and computes totals.
export function buildCartLines(items: CartItem[], products: Product[]): CartLine[] {
  return items.flatMap((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return [];
    const config = product.configurations.find((c) => c.label === item.configuration);
    const unitPrice = config?.price ?? product.price;
    return [{ item, product, lineTotal: unitPrice * item.quantity }];
  });
}

export function getCartTotals(lines: CartLine[], promoCode: string | null) {
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const delivery = lines.length > 0 ? DELIVERY_FEE : 0;
  const discount = Math.min(getDiscount(promoCode), subtotal);
  return { subtotal, delivery, discount, total: subtotal + delivery - discount };
}
