// Account service: real backend calls with mock fallback via NEXT_PUBLIC_USE_MOCK.
// UNVERIFIED: built from OpenAPI schema; confirm field mappings.
import { authApiFetch } from "@/lib/auth";
import { useMock } from "@/lib/api";
import {
  addresses,
  currentUser,
  itServices,
  orders,
  serviceRequests,
  testimonials,
} from "@/lib/mock-data";
import type {
  Address,
  BackendOrder,
  BackendOrderList,
  ItService,
  Order,
  ServiceRequest,
  Testimonial,
  User,
} from "@/types";

function mapBackendOrderToOrder(item: BackendOrderList): Order {
  return {
    id: String(item.order_id),
    date: item.order_date,
    placedAt: item.order_date,
    estimatedDelivery: item.created_at,
    status: (item.status_display || item.status) as Order["status"],
    paymentStatus: "Paid",
    items: [],
    subtotal: Number(item.total_amount) || 0,
    delivery: 0,
    discount: 0,
    total: Number(item.total_amount) || 0,
    deliveryMethod: "Standard Delivery",
    paymentMethod: "MTN MoMo",
    paymentReference: "",
    timeline: [
      { title: "Confirmed", time: item.created_at, note: "Order confirmed", state: "done" },
      { title: "Processing", time: item.created_at, note: "Order being processed", state: "pending" },
      { title: "Packed", time: item.created_at, note: "Awaiting packing", state: "pending" },
      { title: "Out for Delivery", time: item.created_at, note: "Awaiting dispatch", state: "pending" },
      { title: "Delivered", time: item.created_at, note: "Not yet delivered", state: "pending" },
    ],
  };
}

function mapBackendOrderDetailToOrder(item: BackendOrder): Order {
  return {
    id: String(item.order_id),
    date: item.order_date,
    placedAt: item.order_date,
    estimatedDelivery: item.created_at,
    status: (item.status_display || item.status) as Order["status"],
    paymentStatus: "Paid",
    items: item.items.map((i) => ({
      productId: String(i.product.product_id),
      name: i.product.name,
      variant: i.product.category_name,
      quantity: i.quantity,
      price: Number(i.unit_price) || 0,
      image: "",
    })),
    subtotal: Number(item.total_amount) || 0,
    delivery: 0,
    discount: 0,
    total: Number(item.total_amount) || 0,
    deliveryMethod: item.delivery,
    paymentMethod: "",
    paymentReference: "",
    timeline: [],
  };
}

export async function getCurrentUser(): Promise<User> {
  if (useMock()) {
    return currentUser;
  }
  const profile = await authApiFetch<{ first_name: string; last_name: string; email: string; phone: string }>("/accounts/me/");
  if (!profile) {
    return currentUser;
  }
  return {
    firstName: profile.first_name,
    lastName: profile.last_name,
    email: profile.email,
    phone: profile.phone,
  };
}

export async function getOrders(): Promise<Order[]> {
  if (useMock()) {
    return orders;
  }
  const response = await authApiFetch<{ count: number; results: BackendOrderList[] }>("/orders/");
  if (!response || !response.results) return [];
  return response.results.map(mapBackendOrderToOrder);
}

export async function getOrder(id: string): Promise<Order | undefined> {
  if (useMock()) {
    return orders.find((o) => o.id === id);
  }
  try {
    const response = await authApiFetch<BackendOrder>(`/orders/${Number(id)}/`);
    if (!response) return undefined;
    return mapBackendOrderDetailToOrder(response);
  } catch {
    return undefined;
  }
}

export async function cancelOrder(id: string): Promise<Order | undefined> {
  if (useMock()) {
    return undefined;
  }
  try {
    const response = await authApiFetch<BackendOrder>(`/orders/${Number(id)}/cancel/`, {
      method: "POST",
    });
    if (!response) return undefined;
    return mapBackendOrderDetailToOrder(response);
  } catch {
    return undefined;
  }
}

export async function getAddresses(): Promise<Address[]> {
  if (useMock()) {
    return addresses;
  }
  // UNVERIFIED: only GET /customers/address/ exists for the authenticated customer's
  // single residence/phone. No full address CRUD endpoint -> leaving mock data.
  return addresses;
}

export async function getWishlistIds(): Promise<string[]> {
  if (useMock()) {
    return serviceRequests.length > 0 ? [] : [];
  }
  return [];
}

export async function getServiceRequests(): Promise<ServiceRequest[]> {
  if (useMock()) {
    return serviceRequests;
  }
  // UNVERIFIED: customer service requests are at GET /services/ (mapped below in services.ts).
  return serviceRequests;
}

export async function getItServices(): Promise<ItService[]> {
  if (useMock()) {
    return itServices;
  }
  // UNVERIFIED: IT services catalog is at GET /services/ but returns service requests,
  // not service catalog items. Keeping mock data for the public IT services page.
  return itServices;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (useMock()) {
    return testimonials;
  }
  return testimonials;
}
