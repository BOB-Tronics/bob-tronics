// Account service: orders, profile, addresses and the small lists the account pages need.
// Everything here needs a signed-in customer, so it must be called from client components
// (the browser holds the tokens; see authApiFetch).
// Verified live: order detail responses wrap data, and delivery is a nested object.
import { authApiFetch } from "@/lib/auth";
import { isMockMode } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { itServiceCatalogue } from "@/lib/it-services";
import {
  addresses,
  currentUser,
  itServices,
  orders,
  serviceRequests,
  testimonials,
} from "@/lib/mock-data";
import { getReviews } from "@/services/reviews";
import { getServices } from "@/services/services";
import type {
  Address,
  BackendOrder,
  BackendOrderList,
  BackendUserProfile,
  ItService,
  Order,
  OrderStatus,
  ServiceRequest,
  Testimonial,
  TimelineStep,
  User,
} from "@/types";

// Backend statuses (pending, confirmed, processing, shipped, delivered, cancelled)
// mapped onto the five statuses the account UI knows how to display.
export function toOrderStatus(status: string | undefined, display?: string): OrderStatus {
  const value = `${status ?? ""} ${display ?? ""}`.toLowerCase();
  if (value.includes("cancel")) return "Cancelled";
  if (value.includes("out for") || value.includes("ship") || value.includes("transit")) return "Out for delivery";
  if (value.includes("deliver")) return "Delivered";
  if (value.includes("pack") || value.includes("ready")) return "Packed";
  return "Processing";
}

const timelineSteps: { title: OrderStatus; note: string }[] = [
  { title: "Processing", note: "Order received and being prepared" },
  { title: "Packed", note: "Order packed and awaiting courier" },
  { title: "Out for delivery", note: "Courier is on the way" },
  { title: "Delivered", note: "Order delivered" },
];

function buildTimeline(status: OrderStatus, createdAt: string, updatedAt: string): TimelineStep[] {
  if (status === "Cancelled") {
    return [{ title: "Cancelled", time: formatDate(updatedAt || createdAt), note: "This order was cancelled", state: "current" }];
  }
  const current = timelineSteps.findIndex((step) => step.title === status);
  return timelineSteps.map((step, index) => ({
    title: step.title,
    time: index < current ? formatDate(createdAt) : index === current ? formatDate(updatedAt || createdAt) : "Pending",
    note: step.note,
    state: index < current ? "done" : index === current ? "current" : "pending",
  }));
}

function mapBackendOrderToOrder(item: BackendOrderList): Order {
  const status = toOrderStatus(item.status, item.status_display);
  const delivery = typeof item.delivery === "object" && item.delivery ? item.delivery : null;
  return {
    id: String(item.order_id),
    date: item.order_date || item.created_at,
    placedAt: item.order_date || item.created_at,
    estimatedDelivery: item.estimated_delivery ?? delivery?.estimated_delivery ?? "",
    status,
    rawStatus: item.status_display || item.status,
    paymentStatus: item.payment_status ?? "—",
    items: [],
    subtotal: Number(item.total_amount) || 0,
    delivery: 0,
    discount: 0,
    total: Number(item.total_amount) || 0,
    deliveryMethod: delivery?.delivery_method_display ?? delivery?.delivery_method ?? "\u2014",
    paymentMethod: item.payment_method ?? "—",
    paymentReference: item.payment_reference ?? "—",
    deliveryStatus: delivery?.status_display ?? delivery?.status ?? item.delivery_status ?? "\u2014",
    shippingAddress: item.shipping_address,
    phone: item.phone,
    timeline: buildTimeline(status, item.created_at, item.created_at),
  };
}

function mapBackendOrderDetailToOrder(item: BackendOrder): Order {
  const status = toOrderStatus(item.status, item.status_display);
  const delivery = typeof item.delivery === "object" && item.delivery ? item.delivery : null;
  const items = (item.items ?? []).map((line) => ({
    productId: String(line.product?.product_id ?? ""),
    name: line.product?.name ?? "Product",
    variant: line.product?.category_name ?? "",
    quantity: line.quantity,
    price: Number(line.unit_price) || 0,
    image: "",
  }));
  const discount = (item.items ?? []).reduce((sum, line) => sum + (Number(line.discount_amount) || 0), 0);
  const subtotal = (item.items ?? []).reduce((sum, line) => sum + (Number(line.subtotal) || 0), 0);
  const total = Number(item.total_amount) || 0;
  return {
    id: String(item.order_id),
    date: item.order_date || item.created_at,
    placedAt: item.order_date || item.created_at,
    estimatedDelivery: item.estimated_delivery ?? delivery?.estimated_delivery ?? "",
    status,
    rawStatus: item.status_display || item.status,
    paymentStatus: item.payment_status ?? "—",
    items,
    subtotal: subtotal || total,
    delivery: Math.max(0, total - (subtotal || total)),
    discount,
    total,
    deliveryMethod: typeof item.delivery === "string" ? item.delivery : delivery?.delivery_method_display ?? delivery?.delivery_method ?? "\u2014",
    paymentMethod: item.payment_method ?? "—",
    paymentReference: item.payment_reference ?? "—",
    deliveryStatus: delivery?.status_display ?? delivery?.status ?? item.delivery_status ?? "\u2014",
    shippingAddress: item.shipping_address,
    phone: item.phone,
    timeline: buildTimeline(status, item.created_at, item.updated_at),
  };
}

export async function getCurrentUser(): Promise<User> {
  if (isMockMode()) {
    return currentUser;
  }
  const profile = await authApiFetch<BackendUserProfile>("/accounts/me/");
  if (!profile || !profile.email) {
    throw new Error("Failed to load user profile");
  }
  return {
    firstName: profile.first_name,
    lastName: profile.last_name,
    email: profile.email,
    phone: profile.phone,
    residence: profile.residence,
  };
}

// PATCH /accounts/me/ rejects an invalid first_name value; valid profile edits remain unverified.
export async function updateProfile(input: Pick<BackendUserProfile, "first_name" | "last_name" | "phone" | "residence">) {
  return authApiFetch<BackendUserProfile>("/accounts/me/", { method: "PATCH", body: JSON.stringify(input) });
}

// Field names verified with an intentionally wrong current password; successful changes remain unverified.
export async function changePassword(input: { current_password: string; new_password: string; password_confirm: string }) {
  return authApiFetch<{ success?: boolean; message?: string }>("/accounts/change-password/", { method: "POST", body: JSON.stringify(input) });
}

function orderListItems(payload: unknown): BackendOrderList[] {
  if (Array.isArray(payload)) return payload as BackendOrderList[];
  if (!payload || typeof payload !== "object") return [];
  const outer = payload as { results?: unknown; data?: unknown };
  if (Array.isArray(outer.results)) return outer.results as BackendOrderList[];
  if (Array.isArray(outer.data)) return outer.data as BackendOrderList[];
  if (outer.data && typeof outer.data === "object") {
    const nested = outer.data as { results?: unknown };
    if (Array.isArray(nested.results)) return nested.results as BackendOrderList[];
  }
  return [];
}

export async function getOrders(): Promise<Order[]> {
  if (isMockMode()) {
    return orders;
  }
  const response = await authApiFetch<unknown>("/orders/");
  return orderListItems(response).map(mapBackendOrderToOrder);
}

export async function getOrder(id: string): Promise<Order | undefined> {
  if (isMockMode()) {
    return orders.find((o) => o.id === id);
  }
  const response = await authApiFetch<BackendOrder | { success: boolean; data: BackendOrder }>(`/orders/${Number(id)}/`);
  const detail = response && "order_id" in response ? response : response?.data;
  if (!detail || !detail.order_id) return undefined;
  return mapBackendOrderDetailToOrder(detail);
}

// Throws ApiError so the order page can show why a cancellation was refused.
export async function cancelOrder(id: string): Promise<Order | undefined> {
  if (isMockMode()) {
    return undefined;
  }
  const response = await authApiFetch<BackendOrder | { success?: boolean; data?: BackendOrder }>(`/orders/${Number(id)}/cancel/`, {
    method: "POST",
  });
  const detail = response && "order_id" in response ? response : response?.data;
  if (!detail || !detail.order_id) return undefined;
  return mapBackendOrderDetailToOrder(detail);
}

// The backend has no address book; the only saved address is the residence and phone
// on the customer's profile (GET /accounts/me/), shown as the default address.
export async function getAddresses(): Promise<Address[]> {
  if (isMockMode()) {
    return addresses;
  }
  const profile = await authApiFetch<BackendUserProfile>("/accounts/me/");
  if (!profile || !profile.email || !profile.residence) return [];
  return [
    {
      id: "profile",
      label: "Home",
      recipient: `${profile.first_name} ${profile.last_name}`.trim(),
      street: profile.residence,
      city: "",
      code: "",
      phone: profile.phone ?? "",
      isDefault: true,
    },
  ];
}

export async function getWishlistIds(): Promise<string[]> {
  if (isMockMode()) {
    return [];
  }
  // The live wishlist is kept in the useWishlist hook; this stays for the mock path only.
  return [];
}

// Customer service requests come from GET /services/ (login required).
export async function getServiceRequests(): Promise<ServiceRequest[]> {
  if (isMockMode()) {
    return serviceRequests;
  }
  return getServices();
}

// The services on offer are site content (see src/lib/it-services.ts); there is no
// backend endpoint for them, only for customer requests.
export async function getItServices(): Promise<ItService[]> {
  if (isMockMode()) {
    return itServices;
  }
  return itServiceCatalogue;
}

// Home page testimonials are the latest public reviews (GET /reviews/).
export async function getTestimonials(): Promise<Testimonial[]> {
  if (isMockMode()) {
    return testimonials;
  }
  try {
    const reviews = await getReviews();
    return reviews
      .filter((review) => review.text !== "—")
      .slice(0, 3)
      .map((review) => ({
        id: review.id,
        author: review.author,
        text: review.text,
        rating: review.rating,
      }));
  } catch {
    return [];
  }
}
