import { delay } from "@/lib/api";
import { categories, products } from "@/lib/mock-data";
import type { Category, CategorySlug, Product } from "@/types";

export interface ProductFilters {
  category?: CategorySlug;
  search?: string;
}

// Replace the bodies of these functions with fetch calls when the backend exists.
export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  let list = products;
  if (filters.category) {
    list = list.filter((p) => p.category === filters.category);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }
  return delay(list);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return delay(products.find((p) => p.slug === slug));
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  return delay(products.filter((p) => ids.includes(p.id)));
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  return delay(products.filter((p) => p.id !== product.id).slice(0, limit));
}

export async function getCategories(): Promise<Category[]> {
  return delay(categories);
}

export function getProductSync(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
