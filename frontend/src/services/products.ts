import { apiFetch, PaginatedResponse } from "@/lib/api";
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
  brand: string;
  price: string;
  stock_quantity: number;
  is_available: boolean;
  primary_image: string;
}

interface BackendCategory {
  category_id: number;
  name: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
}

function slugify(text: string): CategorySlug {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") as CategorySlug;
}

function mapBackendProductToProduct(item: BackendProduct): Product {
  const stockStatus: Product["stock"] =
    !item.is_available ? "pre-order" : item.stock_quantity > 0 ? "in-stock" : "low-stock";

  return {
    id: String(item.product_id),
    slug: `product-${item.product_id}`,
    name: item.name,
    brand: item.brand,
    category: slugify(item.category_name),
    price: Number(item.price) || 0,
    summary: item.name,
    tagline: item.category_name,
    description: item.name,
    images: item.primary_image ? [item.primary_image] : [],
    rating: 0,
    reviewCount: 0,
    stock: stockStatus,
    stockCount: item.stock_quantity,
    sku: `BT-${item.product_id}`,
    warranty: "",
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
  const query = new URLSearchParams();
  if (filters.category) query.set("category", String(filters.category));
  if (filters.search) query.set("search", filters.search);

  const path = `/catalog/products/${query.toString() ? `?${query.toString()}` : ""}`;
  const response = await apiFetch<PaginatedResponse<BackendProduct>>(path);

  if (!response || !response.results) {
    return [];
  }

  return response.results.map(mapBackendProductToProduct);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  // Extract id if slug follows product-ID pattern
  const parts = slug.split("-");
  const idStr = parts[parts.length - 1];
  const id = Number(idStr);

  if (!isNaN(id)) {
    try {
      const response = await apiFetch<BackendProduct>(`/catalog/products/${id}/`);
      if (response) {
        return mapBackendProductToProduct(response);
      }
    } catch {
      // Fallback or ignore
    }
  }

  // Fallback to fetch all and find
  const productsList = await getProducts();
  return productsList.find((p) => p.slug === slug || p.id === slug);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  const productsList = await getProducts();
  return productsList.filter((p) => ids.includes(p.id));
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const productsList = await getProducts();
  return productsList.filter((p) => p.id !== product.id).slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  const response = await apiFetch<PaginatedResponse<BackendCategory>>("/catalog/categories/");

  if (!response || !response.results) {
    return [];
  }

  return response.results.map(mapBackendCategoryToCategory);
}

export interface ProductReview {
  id: number;
  product: number;
  user?: string;
  rating: number;
  comment: string;
  created_at: string;
}

export async function getProductReviews(productId: string): Promise<ProductReview[]> {
  try {
    const res = await apiFetch<PaginatedResponse<ProductReview> | ProductReview[]>(`/catalog/products/${productId}/reviews/`);
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.results)) return res.results;
  } catch (error) {
    console.warn("Failed to fetch product reviews from API", error);
  }
  return [];
}

export async function addProductReview(productId: string, rating: number, comment: string): Promise<ProductReview | null> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("bob_access_token") : null;
    const res = await apiFetch<ProductReview>(`/catalog/products/${productId}/reviews/`, {
      method: "POST",
      body: { rating, comment } as unknown as BodyInit,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res;
  } catch (error) {
    console.warn("Failed to add product review", error);
    return null;
  }
}