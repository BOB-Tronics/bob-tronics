// Authentication helper: token storage, login/register/logout, and an
// authenticated apiFetch that adds a Bearer token and retries once via refresh.
// UNVERIFIED: login response is based on the supplied real response; confirm the browser session against the backend.

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
const USER_KEY = "bobtronics_user";

export interface Tokens {
  access: string;
  refresh: string;
}

type RefreshResponse = {
  access?: string;
  refresh?: string;
  tokens?: {
    access?: string;
    refresh?: string;
  };
};

function sanitizeErrorBody(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeErrorBody);
  if (typeof value !== "object" || value === null) return value;

  const safe: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    if (!/password|token|secret/i.test(key)) {
      safe[key] = sanitizeErrorBody(item);
    }
  }
  return safe;
}

function buildAuthHeaders(headers: HeadersInit | undefined, accessToken: string): Record<string, string> {
  const result: Record<string, string> = {};
  new Headers(headers).forEach((value, key) => {
    result[key] = value;
  });
  result.Authorization = `Bearer ${accessToken}`;
  return result;
}

function logApiFailure(endpoint: string, error: unknown) {
  const apiError = error instanceof ApiError ? error : null;
  console.warn("API request failed", {
    endpoint,
    status: apiError?.status ?? null,
    responseBody: sanitizeErrorBody(apiError?.data ?? null),
  });
}

export function getStoredTokens(): Tokens | null {
  if (typeof window === "undefined") return null;
  const access = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!access || !refresh) return null;
  return { access, refresh };
}

export function getStoredUser(): BackendUserProfile | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem(USER_KEY);
  if (!user) return null;
  try {
    return JSON.parse(user) as BackendUserProfile;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

function storeUser(user: BackendUserProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
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
  localStorage.removeItem(USER_KEY);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

// UNVERIFIED: refresh accepts { refresh } and may return top-level or nested tokens.
export async function refreshAccessToken(): Promise<Tokens | null> {
  const stored = getStoredTokens();
  if (!stored) return null;

  try {
    let response: RefreshResponse | null;
    try {
      response = await apiFetch<RefreshResponse>("/auth/refresh/", {
        method: "POST",
        body: JSON.stringify({ refresh: stored.refresh }),
      });
    } catch (error: unknown) {
      // The backend also exposes /accounts/token/refresh/; use it if the main path is missing.
      if (!(error instanceof ApiError) || error.status !== 404) throw error;
      response = await apiFetch<RefreshResponse>("/accounts/token/refresh/", {
        method: "POST",
        body: JSON.stringify({ refresh: stored.refresh }),
      });
    }
    const access = response?.access ?? response?.tokens?.access;
    if (!access) return null;

    const tokens: Tokens = {
      access,
      refresh: response?.refresh ?? response?.tokens?.refresh ?? stored.refresh,
    };
    setTokens(tokens);
    return tokens;
  } catch (error: unknown) {
    logApiFailure("/auth/refresh/", error);
    return null;
  }
}

// UNVERIFIED: backend login response has nested tokens and a user object.
export async function login(email: string, password: string) {
  const response = await apiFetch<LoginResponse>("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (!response?.user || !response.tokens?.access || !response.tokens?.refresh) {
    throw new ApiError("Login failed", 400);
  }

  setTokens({
    access: response.tokens.access,
    refresh: response.tokens.refresh,
  });
  storeUser(response.user);
  return response;
}

export async function register(data: RegisterInput) {
  return apiFetch<BackendUserProfile>("/accounts/register/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMe() {
  const user = await authApiFetch<BackendUserProfile>("/accounts/me/");
  if (user) storeUser(user);
  return user;
}

export async function logout() {
  const stored = getStoredTokens();
  if (stored) {
    try {
      await authApiFetch<MessageResponse>("/accounts/logout/", {
        method: "POST",
        body: JSON.stringify({ refresh: stored.refresh }),
      });
    } catch {
      // Ignore logout errors; always clear the local session.
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

// UNVERIFIED: GET activation query-parameter names (uid, token) are assumed from the POST body.
export async function activateFromEmailLink(uid: string, token: string) {
  const query = new URLSearchParams({ uid, token });
  return apiFetch<MessageResponse>(`/accounts/activate/?${query.toString()}`, { method: "GET" });
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
  try {
    return await refreshPromise;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

// Every browser request through this helper gets the current access token.
export async function authApiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T | null> {
  const token = getAccessToken();

  // Client layouts call this only after checking local storage. Keep server
  // rendering safe because browser tokens are unavailable during prerendering.
  if (!token && typeof window === "undefined") {
    return {} as unknown as T;
  }
  if (!token) {
    throw new ApiError("Authentication required", 401);
  }

  const headers = buildAuthHeaders(options.headers, token);

  try {
    return await apiFetch<T>(path, { ...options, headers });
  } catch (error: unknown) {
    logApiFailure(path, error);
    if (!(error instanceof ApiError) || error.status !== 401) {
      throw error;
    }

    const refreshed = await performRefresh();
    if (!refreshed) {
      clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/sign-in";
      }
      throw new ApiError("Session expired. Please sign in again.", 401);
    }

    const retryHeaders = buildAuthHeaders(options.headers, refreshed.access);
    try {
      return await apiFetch<T>(path, { ...options, headers: retryHeaders });
    } catch (retryError: unknown) {
      logApiFailure(path, retryError);
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