// Public review endpoints.
// UNVERIFIED: built from OpenAPI schema; confirm Feedback shape and pagination.
import { apiFetch, useMock } from "@/lib/api";
import type { BackendFeedback } from "@/types";

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
}

export interface CreateReviewInput {
  product: number;
  rating: number;
  comment: string;
}

function mapBackendFeedback(item: BackendFeedback): Review {
  return {
    id: String(item.feedback_id),
    author: `user-${item.user}`,
    rating: item.rating,
    date: item.created_at,
    text: item.comment,
  };
}

export async function getReviews(): Promise<Review[]> {
  if (useMock()) {
    return [];
  }
  try {
    const response = await apiFetch<{ count: number; results: BackendFeedback[] }>(
      "/reviews/"
    );
    if (!response || !response.results) return [];
    return response.results.map(mapBackendFeedback);
  } catch {
    return [];
  }
}

export async function getReview(id: string | number): Promise<Review | null> {
  if (useMock()) {
    return null;
  }
  try {
    const response = await apiFetch<BackendFeedback>(`/reviews/${id}/`);
    if (!response) return null;
    return mapBackendFeedback(response);
  } catch {
    return null;
  }
}

export async function createReview(input: CreateReviewInput): Promise<Review | null> {
  if (useMock()) {
    return null;
  }
  try {
    const response = await apiFetch<BackendFeedback>("/reviews/", {
      method: "POST",
      body: JSON.stringify(input),
    });
    if (!response) return null;
    return mapBackendFeedback(response);
  } catch {
    return null;
  }
}
