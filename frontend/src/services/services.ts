// IT service request endpoints (login required).
// UNVERIFIED: built from docs; confirm ServiceCreate and Service shapes with a signed-in customer.
import { authApiFetch } from "@/lib/auth";
import { isMockMode } from "@/lib/api";
import type { BackendService, ServiceCreateInput, ServiceRequest } from "@/types";

export type { ServiceRequest };

type ServiceList = BackendService[] | { count: number; results: BackendService[] };

function mapBackendServiceToRequest(item: BackendService): ServiceRequest {
  return {
    id: String(item.service_id),
    service: item.name,
    status: item.status_display || item.status,
    date: item.requested_at || item.created_at,
    location: item.customer_email,
    description: item.description,
    serviceType: item.service_type_display || item.service_type,
    estimatedCost: item.estimated_cost,
    finalCost: item.final_cost,
  };
}

export async function getServices(): Promise<ServiceRequest[]> {
  if (isMockMode()) {
    return [];
  }
  const response = await authApiFetch<ServiceList>("/services/");
  if (!response) return [];
  const results = Array.isArray(response) ? response : response.results ?? [];
  return results.map(mapBackendServiceToRequest);
}

// Throws ApiError (for example 401 when signed out) so forms can show the real reason.
export async function createService(input: ServiceCreateInput): Promise<ServiceRequest | null> {
  if (isMockMode()) {
    return null;
  }
  const response = await authApiFetch<BackendService>("/services/", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!response) return null;
  return mapBackendServiceToRequest(response);
}

export async function getService(id: string | number): Promise<ServiceRequest | null> {
  if (isMockMode()) {
    return null;
  }
  const response = await authApiFetch<BackendService>(`/services/${Number(id)}/`);
  if (!response) return null;
  return mapBackendServiceToRequest(response);
}
