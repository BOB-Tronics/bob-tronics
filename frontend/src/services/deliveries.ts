// Delivery endpoints: public tracking by tracking number, and per-order delivery (login required).
// UNVERIFIED: built from docs; /deliveries/track/{tracking_number}/ was only tested with an
// unknown number (404 with the standard error envelope).
import { apiFetch, ApiError, isMockMode } from "@/lib/api";
import { authApiFetch } from "@/lib/auth";
import type { BackendDelivery, BackendDeliveryTracking } from "@/types";

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
    statusDisplay: item.status_display || item.status,
    deliveryMethod: item.delivery_method,
    deliveryMethodDisplay: item.delivery_method_display || item.delivery_method,
    deliveryAddress: item.delivery_address,
    shippedAt: item.shipped_at,
    deliveredAt: item.delivered_at,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

// The per-order endpoint may return the fuller Delivery shape (nested order) or the
// tracking shape; both are mapped to the same view model.
function mapBackendDelivery(item: BackendDelivery | BackendDeliveryTracking): DeliveryTracking {
  if ("order" in item && item.order && typeof item.order === "object") {
    return {
      trackingNumber: item.tracking_number,
      orderId: item.order.order_id,
      status: item.status,
      statusDisplay: item.status_display || item.status,
      deliveryMethod: item.delivery_method,
      deliveryMethodDisplay: item.delivery_method_display || item.delivery_method,
      deliveryAddress: item.delivery_address,
      shippedAt: item.shipped_at,
      deliveredAt: item.delivered_at,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    };
  }
  return mapBackendDeliveryTracking(item as BackendDeliveryTracking);
}

function mapBackendDeliveryMethod(item: { delivery_method: string; delivery_method_display: string; shipping_fee: string }): DeliveryMethod {
  return {
    id: item.delivery_method,
    name: item.delivery_method,
    displayName: item.delivery_method_display || item.delivery_method,
    fee: Number(item.shipping_fee) || 0,
    estimatedDays: 0,
  };
}

// Public tracking: returns null when the tracking number is unknown (404).
export async function trackDelivery(trackingNumber: string): Promise<DeliveryTracking | null> {
  if (isMockMode()) {
    return null;
  }
  try {
    const response = await apiFetch<BackendDeliveryTracking>(
      `/deliveries/track/${encodeURIComponent(trackingNumber.trim())}/`
    );
    if (!response) return null;
    return mapBackendDeliveryTracking(response);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

// Delivery details for one of the signed-in customer's orders. Returns null when the
// order has no delivery record yet (404).
export async function getDeliveryForOrder(orderId: string | number): Promise<DeliveryTracking | null> {
  if (isMockMode()) {
    return null;
  }
  try {
    const response = await authApiFetch<BackendDelivery | BackendDeliveryTracking>(
      `/deliveries/orders/${orderId}/`
    );
    if (!response) return null;
    return mapBackendDelivery(response);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

// Available delivery methods and fees (login required).
export async function getDeliveryMethods(): Promise<DeliveryMethod[]> {
  if (isMockMode()) {
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
