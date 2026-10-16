// Authentication helper: token storage, login/register/logout, and an
// authenticated apiFetch that auto-injects "Authorization: Bearer <access>"
// and retries once via /auth/refresh/ on 401.
// UNVERIFIED: built from OpenAPI schema; confirm real login flow works.

import { apiFetch, ApiError } from "@/lib/api";
import type {
  ActivationInput,
  BackendUserProfile,
  LoginResponse,
  MessageResponse,
  PasswordResetConfirmInput,
  PasswordResetInput,
  RegisterInput,
  TokenResponse,
} from "@/types";

const ACCESS_TOKEN_KEY = "bobtronics_access_token";
const REFRESH_TOKEN_KEY = "bobtronics_refresh_token";

export interface Tokens {
  access: string;
  refresh: string;
}

export function getStoredTokens(): Tokens | null {
  if (typeof window === "undefined") return null;
  const access = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!access || !refresh) return null;
  return { access, refresh };
}

export function setTokens(tokens: Tokens) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

// Refresh the access token using the stored refresh token. Returns new tokens
// or null if refresh fails.
export async function refreshAccessToken(): Promise<Tokens | null> {
  const stored = getStoredTokens();
  if (!stored) return null;
  try {
    const response = await apiFetch<TokenResponse>("/auth/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh: stored.refresh }),
    });
    if (response && response.access && response.refresh) {
      setTokens(response);
      return response;
    }
    return null;
  } catch {
    return null;
  }
}

export async function login(email: string, password: string) {
  const response = await apiFetch<LoginResponse>("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (!response || !response.tokens) {
    throw new ApiError("Login failed", 400);
  }
  setTokens(response.tokens);
  return response;
}

export async function register(data: RegisterInput) {
  return apiFetch<BackendUserProfile>("/accounts/register/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMe() {
  return apiFetch<BackendUserProfile>("/accounts/me/");
}

export async function logout() {
  const stored = getStoredTokens();
  if (stored) {
    try {
      await apiFetch<MessageResponse>("/accounts/logout/", {
        method: "POST",
        body: JSON.stringify({ refresh: stored.refresh }),
      });
    } catch {
      // Ignore logout errors; always clear local tokens.
    }
  }
  clearTokens();
}

export async function activate(data: ActivationInput) {
  return apiFetch<MessageResponse>("/accounts/activate/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function activateFromEmailLink(uid: string, token: string) {
  return apiFetch<MessageResponse>("/accounts/activate/", {
    method: "GET",
    // UNVERIFIED: GET activation query-parameter shape not confirmed; may need
    // ?uid=...&token=... instead of a body.
  });
}

export async function passwordReset(data: PasswordResetInput) {
  return apiFetch<MessageResponse>("/accounts/password-reset/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function passwordResetConfirm(data: PasswordResetConfirmInput) {
  return apiFetch<MessageResponse>("/accounts/password-reset/confirm/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

let isRefreshing = false;
let refreshPromise: Promise<Tokens | null> | null = null;

async function performRefresh(): Promise<Tokens | null> {
  if (isRefreshing && refreshPromise) return refreshPromise;
  isRefreshing = true;
  refreshPromise = refreshAccessToken();
  const result = await refreshPromise;
  isRefreshing = false;
  refreshPromise = null;
  return result;
}

// Authenticated fetch: injects Bearer token, retries once on 401 after refresh.
// On refresh failure clears tokens and redirects to /sign-in.
export async function authApiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T | null> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    ...options.headers,
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  let response: T | null = null;
  try {
    response = await apiFetch<T>(path, { ...options, headers });
    return response;
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) {
      throw error;
    }

    // 401: try refresh once, then retry the original request.
    const refreshed = await performRefresh();
    if (!refreshed) {
      clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/sign-in";
      }
      throw new ApiError("Session expired. Please sign in again.", 401);
    }

    const retryHeaders: HeadersInit = {
      ...options.headers,
      Authorization: `Bearer ${refreshed.access}`,
    };
    try {
      return await apiFetch<T>(path, { ...options, headers: retryHeaders });
    } catch (retryError) {
      if (retryError instanceof ApiError && retryError.status === 401) {
        clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/sign-in";
        }
      }
      throw retryError;
    }
  }
}
