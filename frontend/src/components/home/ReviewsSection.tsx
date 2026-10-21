import type { Testimonial } from "@/types";
import Card from "@/components/ui/Card";
import Rating from "@/components/ui/Rating";

export default function ReviewCards({ reviews }: { reviews: Testimonial[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {reviews.map((review) => (
        <Card key={review.id}>
          {review.rating === null
            ? <p className="text-sm text-muted">—</p>
            : <Rating value={review.rating} variant="stars" />}
          <blockquote className="mt-4 text-ink">“{review.text}”</blockquote>
          <p className="mt-4 text-sm font-semibold text-ink">{review.author}</p>
        </Card>
      ))}
    </div>
  );
}
