// Review endpoints: public list/detail, authenticated create.
// Live-verified fields: feedback_id, user, product, rating, comment, created_at, updated_at.
// The backend does not return a review status or purchase-verification flag.
import { apiFetch, isMockMode } from "@/lib/api";
import { authApiFetch } from "@/lib/auth";

export interface Review {
  id: string;
  author: string;
  product: string;
  productId: string | null;
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

// Reviews may reference the product by id, or embed a product object.
function readProductId(item: UnknownRecord): string | null {
  const direct = firstValue(item, ["product_id", "product"]);
  if (typeof direct === "number") return String(direct);
  if (typeof direct === "string" && /^\d+$/.test(direct)) return direct;
  const nested = asRecord(direct);
  const nestedId = nested ? firstValue(nested, ["product_id", "id"]) : undefined;
  return typeof nestedId === "number" || typeof nestedId === "string" ? String(nestedId) : null;
}

function readAuthor(item: UnknownRecord): string {
  const user = firstValue(item, ["user_name", "author", "customer_name", "user"]);
  const nested = asRecord(user);
  if (nested) {
    const first = displayValue(firstValue(nested, ["first_name"]));
    const last = displayValue(firstValue(nested, ["last_name"]));
    const full = [first, last].filter((x) => x !== "—").join(" ");
    return full || displayValue(firstValue(nested, ["name", "email"]));
  }
  return typeof user === "number" ? `Customer #${user}` : displayValue(user);
}

function mapBackendFeedback(value: unknown, index: number): Review {
  const item = asRecord(value) ?? {};
  const id = firstValue(item, ["feedback_id", "review_id", "id"]);
  const product = firstValue(item, ["product_name", "product"]);
  const nestedProduct = asRecord(product);
  const rating = firstValue(item, ["rating", "score"]);
  const date = firstValue(item, ["created_at", "date", "created"]);
  const text = firstValue(item, ["comment", "text", "review"]);
  return {
    id: displayValue(id) === "—" ? `review-${index}` : String(id),
    author: readAuthor(item),
    product: nestedProduct
      ? displayValue(firstValue(nestedProduct, ["name"]))
      : typeof product === "number" ? `#${product}` : displayValue(product),
    productId: readProductId(item),
    rating: typeof rating === "number" && Number.isFinite(rating) ? rating : Number(rating) || null,
    date: displayValue(date),
    text: displayValue(text),
    status: displayValue(firstValue(item, ["status", "status_display"])),
  };
}

function extractItems(response: unknown): unknown[] {
  const outer = asRecord(response);
  const payload = outer?.data ?? response;
  const record = asRecord(payload);
  return Array.isArray(payload) ? payload : Array.isArray(record?.results) ? record.results : [];
}

function logReviewShape(endpoint: string, response: unknown) {
  if (process.env.NODE_ENV !== "development") return;
  const firstItem = asRecord(extractItems(response)[0]);
  const fields = firstItem ? Object.keys(firstItem).join(", ") : "(empty)";
  // TEMPORARY: remove after verification. This logs field names only.
  console.info(`[shape] GET ${endpoint} -> ${fields}`);
}

export async function getReviews(): Promise<Review[]> {
  if (isMockMode()) {
    return [];
  }
  const response = await apiFetch<unknown>("/reviews/");
  logReviewShape("/reviews/", response);
  return extractItems(response).map(mapBackendFeedback);
}

// Results are filtered on the client too, so unrelated reviews never show on a product page.
export async function getProductReviews(productId: string | number): Promise<Review[]> {
  if (isMockMode()) {
    return [];
  }
  const endpoint = `/reviews/?product=${encodeURIComponent(String(productId))}`;
  const response = await apiFetch<unknown>(endpoint);
  logReviewShape(endpoint, response);
  const reviews = extractItems(response).map(mapBackendFeedback);
  const hasProductIds = reviews.some((review) => review.productId !== null);
  return hasProductIds
    ? reviews.filter((review) => review.productId === String(productId))
    : reviews;
}

export async function getReview(id: string | number): Promise<Review | null> {
  if (isMockMode()) {
    return null;
  }
  try {
    const response = await apiFetch<unknown>(`/reviews/${id}/`);
    const record = asRecord(response);
    const payload = record?.data ?? response;
    if (!payload) return null;
    return mapBackendFeedback(payload, 0);
  } catch {
    return null;
  }
}

// Login required. Throws ApiError so the form can show the backend message.
export async function createReview(input: CreateReviewInput): Promise<Review | null> {
  if (isMockMode()) {
    return null;
  }
  const response = await authApiFetch<unknown>("/reviews/", {
    method: "POST",
    body: JSON.stringify(input),
  });
  const record = asRecord(response);
  const payload = record?.data ?? response;
  if (!payload) return null;
  return mapBackendFeedback(payload, 0);
}
