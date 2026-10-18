// Public promotion endpoints.
// VERIFIED: /promotions/active/ returns paginated {count,results}; /promotions/products/{id}/
// returns the has_discount shape (tested with has_discount=false). Populated promotion
// fields remain UNVERIFIED until a discount exists.
import { apiFetch, isMockMode } from "@/lib/api";
import { promotions } from "@/lib/mock-data";
import type {
  BackendActivePromotion,
  BackendProductDiscountDetail,
  Product,
  ProductDiscount,
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

type PromotionList = BackendActivePromotion[] | { count: number; results: BackendActivePromotion[] };

function listResults(response: PromotionList | null): BackendActivePromotion[] {
  if (!response) return [];
  return Array.isArray(response) ? response : response.results ?? [];
}

export async function getActivePromotions(): Promise<Promotion[]> {
  if (isMockMode()) {
    return promotions;
  }
  try {
    const response = await apiFetch<PromotionList>("/promotions/active/");
    return listResults(response).map(mapBackendPromotion);
  } catch {
    // Fall back to catalog/active/ if promotions/active/ fails.
    try {
      const response = await apiFetch<PromotionList>("/catalog/active/");
      return listResults(response).map(mapBackendPromotion);
    } catch {
      // Promotions are optional on every page; never block rendering because of them.
      return [];
    }
  }
}

export async function getProductDiscount(productId: string | number): Promise<BackendProductDiscountDetail | null> {
  if (isMockMode()) {
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

// Turns the /promotions/products/{id}/ response into the small shape shown on product pages.
export function discountFromDetail(detail: BackendProductDiscountDetail | null): ProductDiscount | undefined {
  if (!detail || !detail.has_discount) return undefined;
  return {
    discountedPrice: Number(detail.discounted_price) || 0,
    savings: Number(detail.savings_amount) || 0,
    discountType: detail.discount_type ?? "",
    discountValue: Number(detail.discount_value) || 0,
    endDate: detail.end_date,
  };
}

// Attaches active promotions to a product list so cards can show the discounted price.
export function applyPromotions(products: Product[], activePromotions: Promotion[]): Product[] {
  if (activePromotions.length === 0) return products;
  const byProduct = new Map(activePromotions.filter((p) => p.isActive).map((p) => [p.productId, p]));
  return products.map((product) => {
    const promo = byProduct.get(product.id);
    if (!promo) return product;
    return {
      ...product,
      discount: {
        discountedPrice: promo.discountedPrice,
        savings: promo.savings,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        endDate: promo.endDate,
      },
    };
  });
}
