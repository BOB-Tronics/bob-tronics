// Cart service: backend cart operations (authenticated).
// UNVERIFIED: built from OpenAPI schema; confirm cart endpoint shapes.
import { authApiFetch } from "@/lib/auth";

// Backend cart item shape.
export interface BackendCartItem {
  cart_item_id: number;
  product: {
    product_id: number;
    name: string;
    brand: string;
    price: string;
    stock_quantity: number;
    is_available: boolean;
    category_name: string;
  };
  quantity: number;
  subtotal: string;
  is_in_stock: boolean;
  added_at: string;
}

export interface CartItemInput {
  product_id: number;
  quantity: number;
}

// List all cart items (authenticated).
export async function listCartItems(): Promise<BackendCartItem[]> {
  const response = await authApiFetch<BackendCartItem[]>("/cart/");
  if (!response) return [];
  return response;
}

// Add an item to the cart (authenticated).
export async function addCartItem(data: CartItemInput): Promise<BackendCartItem | null> {
  const response = await authApiFetch<BackendCartItem>("/cart/items/", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response) return null;
  return response;
}

// Update cart item quantity (authenticated).
export async function updateCartItem(cartItemId: number, quantity: number): Promise<BackendCartItem | null> {
  const response = await authApiFetch<BackendCartItem>(`/cart/items/${cartItemId}/`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
  if (!response) return null;
  return response;
}

// Remove a single item from the cart (authenticated).
export async function removeCartItem(cartItemId: number): Promise<void> {
  await authApiFetch(`/cart/items/${cartItemId}/`, { method: "DELETE" });
}

// Clear the entire cart (authenticated).
export async function clearCart(): Promise<void> {
  await authApiFetch("/cart/clear/", { method: "DELETE" });
}