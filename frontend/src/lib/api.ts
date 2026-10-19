// Single place for backend configuration. Replace the mock services with
// fetch calls to `${API_URL}/...` when the backend is ready.
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK === undefined ? false : process.env.NEXT_PUBLIC_USE_MOCK === "true";

export function useMock(): boolean {
  return USE_MOCK;
}

// Small helper so mock services behave like real network calls.
export function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T | null> {
  const url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  const body =
    options.body && typeof options.body === "object" && !(options.body instanceof FormData)
      ? JSON.stringify(options.body)
      : options.body;

  const response = await fetch(url, {
    ...options,
    headers,
    body,
  });

  if (response.status === 204) {
    return null;
  }

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      (responseData as { detail?: string })?.detail ?? response.statusText,
      response.status,
      responseData
    );
  }

  return responseData as T;
}