// Public promotion endpoints.
// UNVERIFIED: built from OpenAPI schema; confirm /promotions/active/ vs
// /catalog/active/ returns active discounts.
import { apiFetch, useMock } from "@/lib/api";
import { promotions } from "@/lib/mock-data";
import type {
  BackendActivePromotion,
  BackendProductDiscountDetail,
} from "@/types";

function mapBackendPromotion(item: BackendActivePromotion): Promotion {
  return {
    id: String(item.discount_id),
    productId: String(item.product.product_id),
    productName: item.product.name,
    brand: item.product.brand,
    category: item.product.category_name,
    discountType: item.discount_type,
    discountValue: Number(item.discount_value) || 0,
    originalPrice: Number(item.product.price) || 0,
    discountedPrice: Number(item.discounted_price) || 0,
    savings: Number(item.savings_amount) || 0,
    startDate: item.start_date,
    endDate: item.end_date,
    isActive: item.is_active,
  };
}

export interface Promotion {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  category: string;
  discountType: string;
  discountValue: number;
  originalPrice: number;
  discountedPrice: number;
  savings: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export async function getActivePromotions(): Promise<Promotion[]> {
  // UNVERIFIED: check which of /promotions/active/ or /catalog/active/ returns deals.
  if (useMock()) {
    return promotions;
  }
  try {
    const response = await apiFetch<{ count: number; results: BackendActivePromotion[] }>(
      "/promotions/active/"
    );
    if (!response || !response.results) return [];
    return response.results.map(mapBackendPromotion);
  } catch {
    // Fall back to catalog/active/ if promotions/active/ fails.
    const response = await apiFetch<{ count: number; results: BackendActivePromotion[] }>(
      "/catalog/active/"
    );
    if (!response || !response.results) return [];
    return response.results.map(mapBackendPromotion);
  }
}

export async function getProductDiscount(productId: string | number): Promise<BackendProductDiscountDetail | null> {
  if (useMock()) {
    return null;
  }
  try {
    return await apiFetch<BackendProductDiscountDetail>(
      `/promotions/products/${productId}/`
    );
  } catch {
    return null;
  }
}
