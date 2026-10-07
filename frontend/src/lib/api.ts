// Single place for backend configuration. Replace the mock services with
// fetch calls to `${API_URL}/...` when the backend is ready.
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// Small helper so mock services behave like real network calls.
export function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
