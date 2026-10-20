import type { Product } from "@/types";
import ProductCard from "./ProductCard";
import EmptyState from "@/components/ui/EmptyState";

// Responsive grid: 1 column on phones, 2 on tablets, up to 4 on desktop.
export default function ProductGrid({
  products,
  columns = 4,
  onAddToCart,
  addLabel,
}: {
  products: Product[];
  columns?: 2 | 3 | 4;
  onAddToCart?: (product: Product) => void | Promise<void>;
  addLabel?: string;
}) {
  if (products.length === 0) {
    return <EmptyState title="No products found" description="Try a different category or search." />;
  }

  const columnClass = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div className={`grid grid-cols-1 gap-5 ${columnClass}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} addLabel={addLabel} />
      ))}
    </div>
  );
}
