import { apiFetch, delay } from "@/lib/api";
import {
  addresses,
  currentUser,
  itServices,
  orders,
  serviceRequests,
  testimonials,
  wishlistProductIds,
} from "@/lib/mock-data";
import type { Address, ItService, Order, ServiceRequest, Testimonial, User } from "@/types";

export interface LoginCredentials {
  email?: string;
  username?: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export async function loginUser(credentials: LoginCredentials): Promise<AuthTokens> {
  try {
    const payload = {
      username: credentials.username ?? credentials.email,
      password: credentials.password,
    };
    const res = await apiFetch<AuthTokens>("/auth/token/", {
      method: "POST",
      body: payload as unknown as BodyInit,
    });
    if (res && res.access) {
      if (typeof window !== "undefined") {
        localStorage.setItem("bob_access_token", res.access);
        localStorage.setItem("bob_refresh_token", res.refresh);
      }
      return res;
    }
    throw new Error("Invalid login response");
  } catch (error) {
    console.warn("Backend login failed, using mock auth", error);
    if (typeof window !== "undefined") {
      localStorage.setItem("bob_access_token", "mock-access-token");
      localStorage.setItem("bob_refresh_token", "mock-refresh-token");
    }
    return { access: "mock-access-token", refresh: "mock-refresh-token" };
  }
}

export async function registerUser(data: RegisterData): Promise<User> {
  try {
    const res = await apiFetch<User>("/auth/register/", {
      method: "POST",
      body: data as unknown as BodyInit,
    });
    if (res) return res;
  } catch (error) {
    console.warn("Backend registration failed, fallback to mock user", error);
  }
  return currentUser;
}

export async function refreshToken(refresh: string): Promise<{ access: string }> {
  try {
    const res = await apiFetch<{ access: string }>("/auth/token/refresh/", {
      method: "POST",
      body: { refresh } as unknown as BodyInit,
    });
    if (res && res.access) return res;
  } catch (error) {
    console.warn("Token refresh failed", error);
  }
  return { access: "mock-access-token" };
}

export async function getCurrentUser(): Promise<User> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("bob_access_token") : null;
    const res = await apiFetch<User>("/auth/users/me/", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res) return res;
  } catch (error) {
    console.warn("Failed to fetch user from API, using mock", error);
  }
  return delay(currentUser);
}

export async function getOrders(): Promise<Order[]> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("bob_access_token") : null;
    const res = await apiFetch<{ results?: Order[] } | Order[]>("/orders/", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.results)) return res.results;
  } catch (error) {
    console.warn("Failed to fetch orders from API, using mock", error);
  }
  return delay(orders);
}

export async function getOrder(id: string): Promise<Order | undefined> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("bob_access_token") : null;
    const res = await apiFetch<Order>(`/orders/${id}/`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res) return res;
  } catch (error) {
    console.warn("Failed to fetch order details, using mock", error);
  }
  return delay(orders.find((o) => o.id === id));
}

export async function getAddresses(): Promise<Address[]> {
  return delay(addresses);
}

export async function getWishlistIds(): Promise<string[]> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("bob_access_token") : null;
    const res = await apiFetch<{ results?: { product: number | string }[] } | { product: number | string }[]>("/catalog/wishlist/", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    let items: { product: number | string }[] = [];
    if (Array.isArray(res)) items = res;
    else if (res && Array.isArray(res.results)) items = res.results;

    if (items.length > 0) {
      return items.map((i) => String(i.product));
    }
  } catch (error) {
    console.warn("Failed to fetch wishlist from API, using mock", error);
  }
  return delay(wishlistProductIds);
}

export async function addToWishlistApi(productId: string): Promise<boolean> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("bob_access_token") : null;
    await apiFetch("/catalog/wishlist/", {
      method: "POST",
      body: { product: Number(productId) } as unknown as BodyInit,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return true;
  } catch (error) {
    console.warn("Failed to add to wishlist API", error);
    return false;
  }
}

export async function removeFromWishlistApi(productId: string): Promise<boolean> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("bob_access_token") : null;
    await apiFetch(`/catalog/wishlist/${productId}/`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return true;
  } catch (error) {
    console.warn("Failed to remove from wishlist API", error);
    return false;
  }
}

export async function getServiceRequests(): Promise<ServiceRequest[]> {
  return delay(serviceRequests);
}

export async function getItServices(): Promise<ItService[]> {
  return delay(itServices);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return delay(testimonials);
}
