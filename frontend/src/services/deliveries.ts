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
