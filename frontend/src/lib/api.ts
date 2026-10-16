// Single place for backend configuration. API URLs come from NEXT_PUBLIC_API_URL.
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK === undefined ? true : process.env.NEXT_PUBLIC_USE_MOCK === "true";

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
  const isFormDataBody =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
  });
  new Headers(options.headers).forEach((value, key) => headers.set(key, value));
  if (isFormDataBody) headers.delete("Content-Type");

  const body =
    options.body && typeof options.body === "object" && !isFormDataBody
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
    const data = responseData as {
      detail?: string | string[];
      message?: string;
      error?: {
        status_code?: number;
        message?: string;
        details?: { detail?: string | string[] };
      };
    };
    let message = response.statusText;
    if (data?.error?.details?.detail) {
      const d = data.error.details.detail;
      message = Array.isArray(d) ? d.join(", ") : String(d);
    } else if (data?.error?.message) {
      message = data.error.message;
    } else if (data?.detail) {
      message = Array.isArray(data.detail) ? data.detail.join(", ") : String(data.detail);
    } else if (data?.message) {
      message = data.message;
    }
    throw new ApiError(message, response.status, responseData);
  }

  return responseData as T;
}