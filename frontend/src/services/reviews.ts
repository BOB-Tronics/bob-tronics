// Public review endpoints.
// UNVERIFIED: confirm populated review field aliases against the live backend.
import { apiFetch, useMock } from "@/lib/api";

export interface Review {
  id: string;
  author: string;
  product: string;
  rating: number | null;
  date: string;
  text: string;
  status: string;
}

export interface CreateReviewInput {
  product: number;
  rating: number;
  comment: string;
}

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as UnknownRecord
    : null;
}

function firstValue(item: UnknownRecord, fields: string[]): unknown {
  for (const field of fields) {
    if (item[field] !== undefined && item[field] !== null && item[field] !== "") {
      return item[field];
    }
  }
  return undefined;
}

function displayValue(value: unknown): string {
  return typeof value === "string" || typeof value === "number" ? String(value) : "—";
}

function mapBackendFeedback(value: unknown, index: number): Review {
  const item = asRecord(value) ?? {};
  const id = firstValue(item, ["feedback_id", "review_id", "id"]);
  const user = firstValue(item, ["user_name", "author", "user", "customer_name"]);
  const product = firstValue(item, ["product_name", "product"]);
  const rating = firstValue(item, ["rating", "score"]);
  const date = firstValue(item, ["created_at", "date", "created"]);
  const text = firstValue(item, ["comment", "text", "review"]);
  return {
    id: displayValue(id) === "—" ? `review-${index}` : String(id),
    author: typeof user === "number" ? `user-${user}` : displayValue(user),
    product: typeof product === "number" ? `#${product}` : displayValue(product),
    rating: typeof rating === "number" && Number.isFinite(rating) ? rating : null,
    date: displayValue(date),
    text: displayValue(text),
    status: displayValue(firstValue(item, ["status", "status_display"])),
  };
}

function logReviewShape(response: unknown) {
  if (process.env.NODE_ENV !== "development") return;

  const record = asRecord(response);
  const items = Array.isArray(response)
    ? response
    : Array.isArray(record?.results)
      ? record.results
      : [];
  const firstItem = asRecord(items[0]);
  const fields = firstItem ? Object.keys(firstItem).join(", ") : "(empty)";
  // TEMPORARY: remove after verification. This logs field names only.
  console.info(`[shape] GET /reviews/ -> ${fields}`);
}

export async function getReviews(): Promise<Review[]> {
  if (useMock()) {
    return [];
  }
  const response = await apiFetch<unknown>("/reviews/");
  logReviewShape(response);
  const record = asRecord(response);
  const items = Array.isArray(response)
    ? response
    : Array.isArray(record?.results)
      ? record.results
      : [];
  return items.map(mapBackendFeedback);
}

export async function getReview(id: string | number): Promise<Review | null> {
  if (useMock()) {
    return null;
  }
  try {
    const response = await apiFetch<unknown>(`/reviews/${id}/`);
    if (!response) return null;
    return mapBackendFeedback(response, 0);
  } catch {
    return null;
  }
}

export async function createReview(input: CreateReviewInput): Promise<Review | null> {
  if (useMock()) {
    return null;
  }
  try {
    const response = await apiFetch<unknown>("/reviews/", {
      method: "POST",
      body: JSON.stringify(input),
    });
    if (!response) return null;
    return mapBackendFeedback(response, 0);
  } catch {
    return null;
  }
}
