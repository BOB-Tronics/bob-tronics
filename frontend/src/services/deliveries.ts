// Live-verified public tracking, per-order delivery, and the delivery fee schedule.
import { useState } from "react";
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
  fee: number | null;
  estimatedDays: number | null;
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
  if ("order_id" in item) {
    return mapBackendDeliveryTracking(item);
  }
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

function numericValue(value: unknown): number | null {
  if ((typeof value !== "number" && typeof value !== "string") || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function mapBackendDeliveryMethod(value: unknown): DeliveryMethod {
  const item = typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
  return {
    id: typeof item.method === "string" ? item.method : "—",
    name: typeof item.name === "string" ? item.name : "—",
    displayName: typeof item.name === "string" ? item.name : "—",
    fee: numericValue(item.fee),
    estimatedDays: numericValue(item.estimated_days),
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

// The methods endpoint is absent (404); the verified fee schedule supplies this data instead.
export async function getDeliveryMethods(): Promise<DeliveryMethod[]> {
  if (isMockMode()) {
    return [];
  }
  const response = await apiFetch<unknown>("/deliveries/fees/");
  if (!response) return [];
  const outer = typeof response === "object" && !Array.isArray(response) && response !== null
    ? response as { results?: unknown; data?: unknown }
    : null;
  const values = Array.isArray(response)
    ? response
    : Array.isArray(outer?.results)
      ? outer.results
      : Array.isArray(outer?.data)
        ? outer.data
        : outer?.data && typeof outer.data === "object" && "results" in outer.data && Array.isArray(outer.data.results)
          ? outer.data.results
        : [];
  return values.map(mapBackendDeliveryMethod);
}
