"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Select } from "@/components/ui/Input";
import Rating from "@/components/ui/Rating";
import { ApiError } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { isAuthenticated } from "@/lib/auth";
import { createReview, getProductReviews, type Review } from "@/services/reviews";

const ratingOptions = [5, 4, 3, 2, 1].map((value) => ({ value: String(value), label: `${value} star${value === 1 ? "" : "s"}` }));

// Customer reviews for one product: GET /reviews/ (filtered by product) and POST /reviews/.
export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [needsSignIn, setNeedsSignIn] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;
    getProductReviews(productId)
      .then((list) => {
        if (!cancelled) setReviews(list);
      })
      .catch(() => {
        if (!cancelled) setError("Reviews could not be loaded right now.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const rated = reviews.filter((review) => review.rating !== null);
  const average = rated.length ? rated.reduce((sum, review) => sum + (review.rating ?? 0), 0) / rated.length : 0;

  function openForm() {
    if (!isAuthenticated()) {
      setNeedsSignIn(true);
      return;
    }
    setNeedsSignIn(false);
    setShowForm((open) => !open);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFormError("");
    setSuccess("");
    try {
      const created = await createReview({ product: Number(productId), rating: Number(rating), comment: comment.trim() });
      if (created) setReviews((current) => [created, ...current]);
      setSuccess("Thank you! Your review has been submitted.");
      setComment("");
      setShowForm(false);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setNeedsSignIn(true);
      } else {
        setFormError(err instanceof Error ? err.message : "We could not submit your review. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card id="reviews" className="scroll-mt-28">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h2 className="text-xl font-bold text-ink">Customer Reviews</h2>
        <Button variant="secondary" onClick={openForm}>
          {showForm ? "Close" : "Write a review"}
        </Button>
      </div>
      <div className="mt-5 flex items-center gap-4">
        <p className="text-5xl font-extrabold text-ink">{rated.length ? average.toFixed(1) : "–"}</p>
        <div>
          <Rating value={average} variant="stars" />
          <p className="mt-1 text-muted">
            {reviews.length} verified {reviews.length === 1 ? "review" : "reviews"}
          </p>
        </div>
      </div>

      {needsSignIn && (
        <p className="mt-5 rounded-xl bg-accent p-4 text-sm text-primary">
          <Link href="/sign-in" className="font-semibold underline">Sign in</Link> to write a review for this product.
        </p>
      )}

      {showForm && (
        <form onSubmit={submit} className="mt-5 space-y-4 rounded-xl border border-line p-4">
          <Select label="Your rating" name="rating" options={ratingOptions} value={rating} onChange={(event) => setRating(event.target.value)} />
          <label className="block text-sm font-semibold text-ink">
            Your review
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="What did you like? What could be better?"
              className="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-base font-normal text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
            />
          </label>
          {formError && <p role="alert" className="text-sm text-red-600">{formError}</p>}
          <Button type="submit" loading={submitting}>
            Submit review
          </Button>
        </form>
      )}

      {success && <p role="status" className="mt-5 text-sm font-semibold text-success">{success}</p>}

      {loading ? (
        <p className="mt-6 text-muted">Loading reviews...</p>
      ) : error ? (
        <p className="mt-6 text-muted">{error}</p>
      ) : reviews.length === 0 ? (
        <p className="mt-6 text-muted">No reviews yet. Be the first to share your experience.</p>
      ) : (
        <ul className="mt-6 divide-y divide-line">
          {reviews.map((review) => (
            <li key={review.id} className="py-4">
              <p className="font-semibold text-ink">{review.author} · Verified purchase</p>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted">
                <Rating value={review.rating ?? 0} variant="stars" /> · {review.date !== "—" ? formatDate(review.date) : "—"}
              </div>
              <p className="mt-2 text-ink/80">{review.text}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
