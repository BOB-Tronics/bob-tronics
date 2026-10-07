import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <div className="page-container py-16">
      <EmptyState
        title="We couldn’t find that page"
        description="The link may be out of date, or the product is no longer available."
        action={<Button href="/">Back to home</Button>}
      />
    </div>
  );
}
