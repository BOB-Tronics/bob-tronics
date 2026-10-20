import { apiFetch, ApiError, isMockMode } from "@/lib/api";
import { resolveImageUrl } from "@/lib/resolveImageUrl";
import { categories, products } from "@/lib/mock-data";
import type { Category, CategorySlug, Product } from "@/types";

export interface ProductFilters {
  category?: CategorySlug;
  categoryId?: number;
  search?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

interface BackendProduct {
  product_id: number;
  category: number;
  category_name: string;
  name: string;
  description: string;
  brand: string;
  price: string;
  stock_quantity: number;
  warranty: string;
  is_available: boolean;
  average_rating?: number | string;
  review_count?: number;
  primary_image?: string | null;
  images?: Array<{ image_id: number; image_url: string; is_primary: boolean }>;
  created_at: string;
  updated_at: string;
}

interface BackendCategory {
  category_id: number;
  name: string;
  description: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

// Internal cache: frontend product id (string) -> backend category id (number)
// Populated by getProducts and getProduct so getRelatedProducts can look it up.
const productCategoryIdMap = new Map<string, number>();
const categoryIdBySlug = new Map<CategorySlug, number>();

function listItems<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (!payload || typeof payload !== "object") return [];
  const outer = payload as { results?: unknown; data?: unknown };
  if (Array.isArray(outer.results)) return outer.results as T[];
  if (Array.isArray(outer.data)) return outer.data as T[];
  if (outer.data && typeof outer.data === "object") {
    const nested = outer.data as { results?: unknown };
    if (Array.isArray(nested.results)) return nested.results as T[];
  }
  return [];
}

function unwrap<T>(payload: T | { data?: T } | null): T | null {
  if (!payload) return null;
  return typeof payload === "object" && payload !== null && "data" in payload
    ? (payload as { data?: T }).data ?? null
    : payload as T;
}

function slugify(text: string): CategorySlug {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") as CategorySlug;
}

function mapBackendProductToProduct(item: BackendProduct): Product {
  const stockStatus: Product["stock"] =
    !item.is_available ? "pre-order" : item.stock_quantity > 0 ? "in-stock" : "low-stock";

  productCategoryIdMap.set(String(item.product_id), item.category);

  return {
    id: String(item.product_id),
    slug: String(item.product_id),
    name: item.name,
    brand: item.brand,
    category: slugify(item.category_name),
    price: Number(item.price) || 0,
    // The list endpoint has no description, so the card line falls back to the category.
    summary: item.description || item.category_name,
    tagline: item.category_name,
    description: item.description,
    images: [
      item.primary_image,
      ...(item.images ?? []).filter((img) => img.is_primary).map((img) => img.image_url),
      ...(item.images ?? []).filter((img) => !img.is_primary).map((img) => img.image_url),
    ].map(resolveImageUrl).filter(Boolean),
    rating: Number(item.average_rating) || 0,
    reviewCount: Number(item.review_count) || 0,
    stock: stockStatus,
    stockCount: item.stock_quantity,
    sku: `BT-${item.product_id}`,
    warranty: item.warranty,
    finishes: [],
    configurations: [],
    highlights: [],
    specs: [],
    included: [],
    reviews: [],
    faqs: [],
  };
}

function mapBackendCategoryToCategory(item: BackendCategory): Category {
  return {
    slug: slugify(item.name),
    backendId: item.category_id,
    name: item.name,
    tagline: item.description,
    image: resolveImageUrl(item.image),
    count: 0,
    subcategories: [],
  };
}

// Replace the bodies of these functions with fetch calls when the backend exists.
export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  if (isMockMode()) {
    let result = products;
    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }
    if (filters.brand) result = result.filter((p) => p.brand === filters.brand);
    if (filters.minPrice !== undefined) result = result.filter((p) => p.price >= filters.minPrice!);
    if (filters.maxPrice !== undefined) result = result.filter((p) => p.price <= filters.maxPrice!);
    if (filters.inStock) result = result.filter((p) => p.stockCount > 0);
    return result;
  }

  const query = new URLSearchParams();
  if (filters.categoryId !== undefined) query.set("category", String(filters.categoryId));
  else if (filters.category) {
    const categoryId = categoryIdBySlug.get(filters.category);
    if (categoryId !== undefined) query.set("category", String(categoryId));
  }
  if (filters.search) query.set("search", filters.search);
  if (filters.brand) query.set("brand", filters.brand);
  if (filters.minPrice !== undefined) query.set("min_price", String(filters.minPrice));
  if (filters.maxPrice !== undefined) query.set("max_price", String(filters.maxPrice));
  if (filters.inStock) query.set("in_stock", "true");

  const path = `/catalog/products/${query.toString() ? `?${query.toString()}` : ""}`;
  const response = await apiFetch<unknown>(path);
  const rows = listItems<BackendProduct>(response);
  return rows.map(mapBackendProductToProduct);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  if (isMockMode()) {
    return getProductSync(slug);
  }

  try {
    const response = unwrap(await apiFetch<BackendProduct | { data?: BackendProduct }>(`/catalog/products/${slug}/`));
    if (!response) return undefined;
    return mapBackendProductToProduct(response);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return undefined;
    }
    throw error;
  }
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (isMockMode()) {
    return products.filter((p) => ids.includes(p.id));
  }

  const result: Product[] = [];
  for (const id of ids) {
    try {
      const product = await getProduct(id);
      if (product) result.push(product);
    } catch {
      // Skip products that fail to load.
    }
  }
  return result;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  if (isMockMode()) {
    return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit);
  }

  const categoryId = productCategoryIdMap.get(product.id);

  if (categoryId === undefined) {
    return products.filter((p) => p.id !== product.id).slice(0, limit);
  }

  const response = await apiFetch<unknown>(
    `/catalog/categories/${categoryId}/products/`
  );

  return listItems<BackendProduct>(response)
    .map(mapBackendProductToProduct)
    .filter((p) => p.id !== product.id)
    .slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  if (isMockMode()) {
    return categories;
  }

  // Backend returns a plain array [], not a paginated {count, results} object.
  const response = await apiFetch<unknown>(
    "/catalog/categories/"
  );

  const results = listItems<BackendCategory>(response);
  for (const item of results) categoryIdBySlug.set(slugify(item.name), item.category_id);
  return results.map(mapBackendCategoryToCategory);
}

export function getProductSync(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
