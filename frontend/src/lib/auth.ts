// Authentication helper: token storage, login/register/logout, and an
// authenticated apiFetch that adds a Bearer token and retries once via refresh.
// UNVERIFIED: login response is based on the supplied real response; confirm the browser session against the backend.

import { apiFetch, ApiError, delay, isMockMode } from "@/lib/api";
import type {
  ActivationInput,
  BackendUserProfile,
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

// ---- Mock auth (used when NEXT_PUBLIC_USE_MOCK=true) ----

const MOCK_TOKENS: Tokens = {
  access: "mock-access-token",
  refresh: "mock-refresh-token",
};

const MOCK_USER: BackendUserProfile = {
  user_id: 1,
  email: "demo@bobtronics.com",
  first_name: "Demo",
  last_name: "User",
  role: "admin",
  phone: "+250700000000",
  residence: "Kigali, Rwanda",
  created_at: new Date().toISOString(),
};

export async function mockLogin(email: string, password: string) {
  await delay(null, 800);
  if (!email || !password) {
    throw new ApiError("Please enter both email and password.", 400);
  }
  setTokens(MOCK_TOKENS);
  return { user: MOCK_USER, tokens: MOCK_TOKENS } ;
}

export async function mockRegister(data: RegisterInput) {
  await delay(null, 800);
  if (!data.first_name || !data.last_name || !data.email || !data.password || !data.password_confirm) {
    throw new ApiError("Please fill in all fields.", 400);
  }
  if (data.password !== data.password_confirm) {
    throw new ApiError("Passwords do not match.", 400);
  }
  if (data.password.length < 8) {
    throw new ApiError("Password must be at least 8 characters.", 400);
  }
  return { ...MOCK_USER, first_name: data.first_name, last_name: data.last_name, email: data.email } as BackendUserProfile;
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

type LoginResponseCompat = {
  message?: string;
  user?: BackendUserProfile;
  tokens?: { access?: string; refresh?: string };
  data?: { access?: string; refresh?: string; user?: BackendUserProfile };
  access?: string;
  refresh?: string;
};

// Accept both documented login envelopes; fetch the profile when login omits it.
export async function login(email: string, password: string) {
  const response = await apiFetch<LoginResponseCompat>("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const access = response?.tokens?.access ?? response?.data?.access ?? response?.access;
  const refresh = response?.tokens?.refresh ?? response?.data?.refresh ?? response?.refresh;
  if (!access || !refresh) {
    throw new ApiError("Login failed", 400);
  }

  setTokens({ access, refresh });
  const user = response?.user ?? response?.data?.user ?? await getMe();
  if (!user) throw new ApiError("Unable to load user profile", 502);
  storeUser(user);
  return { ...response, user };
}

// UNVERIFIED: Google login is assumed to return the same token/user envelope as /auth/login/.
export async function loginWithGoogle(credential: string) {
  try {
    const response = await apiFetch<LoginResponseCompat>("/auth/google/", {
      method: "POST",
      body: JSON.stringify({ credential }),
    });
    const access = response?.tokens?.access ?? response?.data?.access ?? response?.access;
    const refresh = response?.tokens?.refresh ?? response?.data?.refresh ?? response?.refresh;
    if (!access || !refresh) {
      throw new ApiError("Google sign-in response did not include session tokens.", 502, response);
    }

    setTokens({ access, refresh });
    const user = response?.user ?? response?.data?.user ?? await getMe();
    if (!user) throw new ApiError("Unable to load user profile", 502);
    storeUser(user);
    return user;
  } catch (error: unknown) {
    logApiFailure("/auth/google/", error);
    throw error;
  }
}

export async function register(data: RegisterInput) {
  if (isMockMode()) {
    return mockRegister(data);
  }
  return apiFetch<BackendUserProfile>("/accounts/register/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function mockGetMe(): Promise<BackendUserProfile> {
  await delay(null, 300);
  return MOCK_USER;
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

type PasswordResetResponse = MessageResponse | {
  success?: boolean;
  data?: MessageResponse | null;
} | null;

function unwrapPasswordResetResponse(response: PasswordResetResponse): MessageResponse | null {
  if (!response) return null;
  if ("data" in response) {
    const message = response.data && typeof response.data === "object" ? response.data.message : undefined;
    return typeof message === "string" ? { message } : null;
  }
  return "message" in response && typeof response.message === "string"
    ? { message: response.message }
    : null;
}

async function sendPasswordResetRequest(
  endpoint: string,
  body: PasswordResetInput | PasswordResetConfirmInput
): Promise<MessageResponse | null> {
  // UNVERIFIED: successful delivery and password change require a real email link.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90_000);
    try {
      const response = await apiFetch<PasswordResetResponse>(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      return unwrapPasswordResetResponse(response);
    } catch (error) {
      const missingApiUrl = error instanceof Error && error.message === "NEXT_PUBLIC_API_URL is not set";
      const shouldRetry = !missingApiUrl && (!(error instanceof ApiError) || error.status >= 500);
      if (!shouldRetry || attempt === 1) throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
  return null;
}

export function requestPasswordReset(email: string) {
  return sendPasswordResetRequest("/accounts/password-reset/", { email });
}

export function confirmPasswordReset(data: PasswordResetConfirmInput) {
  return sendPasswordResetRequest("/accounts/password-reset/confirm/", data);
}

// Keep the existing auth service names available for any callers outside these screens.
export function passwordReset(data: PasswordResetInput) {
  return requestPasswordReset(data.email);
}

export function passwordResetConfirm(data: PasswordResetConfirmInput) {
  return confirmPasswordReset(data);
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
    if (!(error instanceof ApiError) || error.status !== 401) {
      logApiFailure(path, error);
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
