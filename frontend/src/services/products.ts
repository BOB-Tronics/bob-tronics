import { apiFetch, PaginatedResponse, ApiError, useMock } from "@/lib/api";
import { categories, products } from "@/lib/mock-data";
import type { Category, CategorySlug, Product } from "@/types";

export interface ProductFilters {
  category?: CategorySlug;
  search?: string;
}

interface BackendProduct {
  product_id: number;
  category: number;
  category_name: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  price: string;
  stock_quantity: number;
  warranty: string;
  is_available: boolean;
  average_rating: number;
  review_count: number;
  images: Array<{ image_id: number; image_url: string; is_primary: boolean }>;
  created_at: string;
  updated_at: string;
}

interface BackendCategory {
  category_id: number;
  name: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
}

// Internal cache: frontend product id (string) -> backend category id (number)
// Populated by getProducts and getProduct so getRelatedProducts can look it up.
const productCategoryIdMap = new Map<string, number>();

function slugify(text: string): CategorySlug {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") as CategorySlug;
}

function mapBackendProductToProduct(item: BackendProduct): Product {
  const stockStatus: Product["stock"] =
    !item.is_available ? "pre-order" : item.stock_quantity > 0 ? "in-stock" : "low-stock";

  productCategoryIdMap.set(String(item.product_id), item.category);

  return {
    id: String(item.product_id),
    slug: item.slug ?? String(item.product_id),
    name: item.name,
    brand: item.brand,
    category: slugify(item.category_name),
    price: Number(item.price) || 0,
    summary: item.description || item.name,
    tagline: item.category_name,
    description: item.description,
    images: item.images?.map((img) => img.image_url) || [],
    rating: item.average_rating ?? 0,
    reviewCount: item.review_count ?? 0,
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
    name: item.name,
    tagline: item.description,
    image: item.image,
    count: 0,
    subcategories: [],
  };
}

// Replace the bodies of these functions with fetch calls when the backend exists.
export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  if (useMock()) {
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
    return result;
  }

  const query = new URLSearchParams();
  if (filters.category) query.set("category", String(filters.category));
  if (filters.search) query.set("search", filters.search);

  const path = `/catalog/products/${query.toString() ? `?${query.toString()}` : ""}`;
  let response: PaginatedResponse<BackendProduct> | null = null;
  try {
    response = await apiFetch<PaginatedResponse<BackendProduct>>(path);
  } catch {
    // Backend unavailable or endpoint not ready — fall back to empty results.
    return [];
  }

  if (!response || !response.results) {
    return [];
  }

  return response.results.map(mapBackendProductToProduct);
}

export async function getProduct(productIdOrSlug: string): Promise<Product | undefined> {
  if (useMock()) {
    return getProductSync(productIdOrSlug);
  }

  // Backend uses integer product_id in the URL path.
  const numericId = Number(productIdOrSlug);
  const id = Number.isFinite(numericId) ? numericId : productIdOrSlug;

  try {
    const response = await apiFetch<BackendProduct>(`/catalog/products/${id}/`);
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
  if (useMock()) {
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
  if (useMock()) {
    return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit);
  }

  const categoryId = productCategoryIdMap.get(product.id);

  if (categoryId === undefined) {
    return products.filter((p) => p.id !== product.id).slice(0, limit);
  }

  let response: PaginatedResponse<BackendProduct> | null = null;
  try {
    response = await apiFetch<PaginatedResponse<BackendProduct>>(
      `/catalog/categories/${categoryId}/products/`
    );
  } catch {
    // Backend unavailable or endpoint not ready — fall back to empty results.
    return [];
  }

  if (!response || !response.results) {
    return [];
  }

  return response.results
    .map(mapBackendProductToProduct)
    .filter((p) => p.id !== product.id)
    .slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  if (useMock()) {
    return categories;
  }

  let response: PaginatedResponse<BackendCategory> | null = null;
  try {
    response = await apiFetch<PaginatedResponse<BackendCategory>>("/catalog/categories/");
  } catch {
    // Backend unavailable or endpoint not ready — fall back to empty results.
    return [];
  }

  if (!response || !response.results) {
    return [];
  }

  return response.results.map(mapBackendCategoryToCategory);
}

export function getProductSync(idOrSlug: string): Product | undefined {
  return products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}