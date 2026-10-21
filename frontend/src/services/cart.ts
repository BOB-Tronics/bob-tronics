// Cart service: backend cart operations (authenticated).
import { authApiFetch } from "@/lib/auth";
import type { BackendCartItem } from "@/types";

export type { BackendCartItem } from "@/types";

export interface CartItemInput {
  product_id: number;
  quantity: number;
}

type CartListResponse =
  | BackendCartItem[]
  | {
      items?: BackendCartItem[];
      results?: BackendCartItem[];
      cart_items?: BackendCartItem[];
      data?: BackendCartItem[] | {
        items?: BackendCartItem[];
        results?: BackendCartItem[];
        cart_items?: BackendCartItem[];
      };
    };

function cartItemsFrom(response: CartListResponse | null): BackendCartItem[] {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (response.data) {
    return response.data.items ?? response.data.results ?? response.data.cart_items ?? [];
  }
  return response.items ?? response.results ?? response.cart_items ?? [];
}

// List all cart items (authenticated).
export async function listCartItems(): Promise<BackendCartItem[]> {
  const response = await authApiFetch<CartListResponse>("/cart/");
  return cartItemsFrom(response);
}

// Add an item to the cart (authenticated).
export async function addCartItem(data: CartItemInput): Promise<BackendCartItem | null> {
  const response = await authApiFetch<BackendCartItem | { data?: BackendCartItem }>("/cart/items/", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response) return null;
  return "cart_item_id" in response ? response : response.data ?? null;
}

// Update cart item quantity (authenticated).
export async function updateCartItem(cartItemId: number, quantity: number): Promise<BackendCartItem | null> {
  const response = await authApiFetch<BackendCartItem | { data?: BackendCartItem }>(`/cart/items/${cartItemId}/`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
  if (!response) return null;
  return "cart_item_id" in response ? response : response.data ?? null;
}

// Remove a single item from the cart (authenticated).
export async function removeCartItem(cartItemId: number): Promise<void> {
  await authApiFetch(`/cart/items/${cartItemId}/`, { method: "DELETE" });
}

// Clear the entire cart (authenticated).
export async function clearCart(): Promise<void> {
  await authApiFetch("/cart/clear/", { method: "DELETE" });
}