// Public delivery tracking endpoint.
// UNVERIFIED: built from OpenAPI schema; confirm DeliveryTracking shape.
import { apiFetch, useMock } from "@/lib/api";
import type { BackendDeliveryTracking } from "@/types";

export interface DeliveryTracking {
  trackingNumber: string | null;
  orderId: number;
  status: string;
  statusDisplay: string;
  deliveryMethod: string;
  deliveryMethodDisplay: string;
  deliveryAddress: string;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryMethod {
  id: string;
  name: string;
  displayName: string;
  fee: number;
  estimatedDays: number;
}

function mapBackendDeliveryTracking(item: BackendDeliveryTracking): DeliveryTracking {
  return {
    trackingNumber: item.tracking_number,
    orderId: item.order_id,
    status: item.status,
    statusDisplay: item.status_display,
    deliveryMethod: item.delivery_method,
    deliveryMethodDisplay: item.delivery_method_display,
    deliveryAddress: item.delivery_address,
    shippedAt: item.shipped_at,
    deliveredAt: item.delivered_at,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

function mapBackendDeliveryMethod(item: { delivery_method: string; delivery_method_display: string; shipping_fee: string }): DeliveryMethod {
  return {
    id: item.delivery_method,
    name: item.delivery_method,
    displayName: item.delivery_method_display,
    fee: Number(item.shipping_fee) || 0,
    estimatedDays: item.delivery_method === "express" ? 2 : item.delivery_method === "store_pickup" ? 0 : 5,
  };
}

export async function trackDelivery(trackingNumber: string): Promise<DeliveryTracking | null> {
  if (useMock()) {
    return null;
  }
  try {
    const response = await apiFetch<BackendDeliveryTracking>(
      `/deliveries/track/${trackingNumber}/`
    );
    if (!response) return null;
    return mapBackendDeliveryTracking(response);
  } catch {
    return null;
  }
}

// Delivery details for an order (login required).
export async function getDeliveryForOrder(orderId: string | number): Promise<BackendDeliveryTracking | null> {
  if (useMock()) {
    return null;
  }
  try {
    return await apiFetch<BackendDeliveryTracking>(`/deliveries/orders/${orderId}/`);
  } catch {
    return null;
  }
}

// Available delivery methods and fees (login required).
export async function getDeliveryMethods(): Promise<DeliveryMethod[]> {
  if (useMock()) {
    return [];
  }
  try {
    const response = await apiFetch<{ results: Array<{ delivery_method: string; delivery_method_display: string; shipping_fee: string }> }>("/deliveries/methods/");
    if (!response || !response.results) return [];
    return response.results.map(mapBackendDeliveryMethod);
  } catch {
    return [];
  }
}
