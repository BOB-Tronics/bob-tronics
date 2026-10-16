// IT service request endpoints (login required).
// UNVERIFIED: built from OpenAPI schema; confirm ServiceCreate and Service shapes.
import { authApiFetch } from "@/lib/auth";
import { useMock } from "@/lib/api";
import type { BackendService, ServiceCreateInput } from "@/types";

export interface ServiceRequest {
  id: string;
  service: string;
  status: string;
  date: string;
  location: string;
}

function mapBackendServiceToRequest(item: BackendService): ServiceRequest {
  return {
    id: String(item.service_id),
    service: item.name,
    status: item.status_display || item.status,
    date: item.requested_at,
    location: item.customer_email,
  };
}

export async function getServices(): Promise<ServiceRequest[]> {
  if (useMock()) {
    return [];
  }
  try {
    const response = await authApiFetch<{ count: number; results: BackendService[] }>("/services/");
    if (!response || !response.results) return [];
    return response.results.map(mapBackendServiceToRequest);
  } catch {
    return [];
  }
}

export async function createService(input: ServiceCreateInput): Promise<ServiceRequest | null> {
  if (useMock()) {
    return null;
  }
  try {
    const response = await authApiFetch<BackendService>("/services/", {
      method: "POST",
      body: JSON.stringify(input),
    });
    if (!response) return null;
    return mapBackendServiceToRequest(response);
  } catch {
    return null;
  }
}

export async function getService(id: string | number): Promise<ServiceRequest | null> {
  if (useMock()) {
    return null;
  }
  try {
    const response = await authApiFetch<BackendService>(`/services/${Number(id)}/`);
    if (!response) return null;
    return mapBackendServiceToRequest(response);
  } catch {
    return null;
  }
}
