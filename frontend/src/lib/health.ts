// Public health check helper (tiny helper, no UI).
// UNVERIFIED: confirms the API is responding.
import { apiFetch, isMockMode } from "@/lib/api";

export interface HealthStatus {
  status: string;
}

export async function healthCheck(): Promise<HealthStatus | null> {
  if (isMockMode()) {
    return { status: "ok" };
  }
  try {
    return await apiFetch<HealthStatus>("/health/");
  } catch {
    return null;
  }
}
