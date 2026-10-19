// Admin / operations API service (admin login required).
// UNVERIFIED: built from OpenAPI schema; confirm all field mappings and admin role check.
import { authApiFetch } from "@/lib/auth";
import type {
  BackendAdminCustomerDetail,
  BackendAdminCustomerList,
  BackendCategory,
  BackendDiscount,
  BackendProduct,
  BackendProductImage,
  BackendService,
  PatchedAdminServiceUpdate,
  StockAdjustmentInput,
} from "@/types";

export interface AdminCategory {
  category_id: number;
  name: string;
  description: string;
  image: string;
}

export interface AdminProduct {
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
}

export interface AdminDiscount {
  discount_id: number;
  product: number;
  discount_type: string;
  discount_value: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface AdminService {
  service_id: number;
  name: string;
  description: string;
  service_type: string;
  service_type_display: string;
  status: string;
  status_display: string;
  estimated_cost: string | null;
  final_cost: string | null;
}

export interface AdminCustomer {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  total_orders: number;
}

export interface AdminOrder {
  order_id: number;
  customer_name: string;
  customer_email: string;
  order_date: string;
  status: string;
  status_display: string;
  total_amount: string;
  total_items: number;
}

function jsonBody(data: unknown) {
  return JSON.stringify(data);
}

// ---- Catalog admin: categories ----

export async function adminListCategories() {
  return authApiFetch<{ count: number; results: BackendCategory[] }>("/catalog/admin/categories/");
}

export async function adminCreateCategory(data: BackendCategory) {
  return authApiFetch<BackendCategory>("/catalog/admin/categories/", { method: "POST", body: jsonBody(data) });
}

export async function adminGetCategory(categoryId: number) {
  return authApiFetch<BackendCategory>(`/catalog/admin/categories/${categoryId}/`);
}

export async function adminUpdateCategory(categoryId: number, data: BackendCategory) {
  return authApiFetch<BackendCategory>(`/catalog/admin/categories/${categoryId}/`, { method: "PUT", body: jsonBody(data) });
}

export async function adminPatchCategory(categoryId: number, data: Partial<BackendCategory>) {
  return authApiFetch<BackendCategory>(`/catalog/admin/categories/${categoryId}/`, { method: "PATCH", body: jsonBody(data) });
}

export async function adminDeleteCategory(categoryId: number) {
  return authApiFetch(`/catalog/admin/categories/${categoryId}/`, { method: "DELETE" });
}

// ---- Catalog admin: images ----

export async function adminListImages(params?: { product?: number; is_primary?: boolean }) {
  const query = new URLSearchParams();
  if (params?.product) query.set("product", String(params.product));
  if (params?.is_primary !== undefined) query.set("is_primary", String(params.is_primary));
  const path = query.toString() ? `/catalog/admin/images/?${query.toString()}` : "/catalog/admin/images/";
  return authApiFetch<{ count: number; results: BackendProductImage[] }>(path);
}

export async function adminCreateImage(data: BackendProductImage) {
  return authApiFetch<BackendProductImage>("/catalog/admin/images/", { method: "POST", body: jsonBody(data) });
}

export async function adminGetImage(imageId: number) {
  return authApiFetch<BackendProductImage>(`/catalog/admin/images/${imageId}/`);
}

export async function adminUpdateImage(imageId: number, data: BackendProductImage) {
  return authApiFetch<BackendProductImage>(`/catalog/admin/images/${imageId}/`, { method: "PUT", body: jsonBody(data) });
}

export async function adminPatchImage(imageId: number, data: Partial<BackendProductImage>) {
  return authApiFetch<BackendProductImage>(`/catalog/admin/images/${imageId}/`, { method: "PATCH", body: jsonBody(data) });
}

export async function adminDeleteImage(imageId: number) {
  return authApiFetch(`/catalog/admin/images/${imageId}/`, { method: "DELETE" });
}

// ---- Catalog admin: products ----

export async function adminListProducts() {
  return authApiFetch<{ count: number; results: BackendProduct[] }>("/catalog/admin/products/");
}

export async function adminCreateProduct(data: BackendProduct) {
  return authApiFetch<BackendProduct>("/catalog/admin/products/", { method: "POST", body: jsonBody(data) });
}

export async function adminGetProduct(productId: number) {
  return authApiFetch<BackendProduct>(`/catalog/admin/products/${productId}/`);
}

export async function adminUpdateProduct(productId: number, data: BackendProduct) {
  return authApiFetch<BackendProduct>(`/catalog/admin/products/${productId}/`, { method: "PUT", body: jsonBody(data) });
}

export async function adminPatchProduct(productId: number, data: Partial<BackendProduct>) {
  return authApiFetch<BackendProduct>(`/catalog/admin/products/${productId}/`, { method: "PATCH", body: jsonBody(data) });
}

export async function adminDeleteProduct(productId: number) {
  return authApiFetch(`/catalog/admin/products/${productId}/`, { method: "DELETE" });
}

export async function adminAdjustStock(productId: number, data: StockAdjustmentInput) {
  return authApiFetch<BackendProduct>(`/catalog/admin/products/${productId}/adjust-stock/`, {
    method: "POST",
    body: jsonBody(data),
  });
}

export async function adminLowStock(threshold: number) {
  return authApiFetch<{ count: number; results: BackendProduct[] }>(`/catalog/admin/products/low-stock/?threshold=${threshold}`);
}

// ---- Stock history admin ----

export interface StockHistoryEntry {
  id: number;
  product_id: number;
  product_name: string;
  previous_quantity: number;
  new_quantity: number;
  delta: number;
  reason: string;
  changed_by: string;
  changed_at: string;
}

export async function adminStockHistory(productId?: number) {
  const query = productId !== undefined ? `?product_id=${productId}` : "";
  return authApiFetch<{ count: number; results: StockHistoryEntry[] }>(`/catalog/admin/stock-history/${query}`);
}

// ---- Discounts admin (main: /promotions/admin/discounts/) ----

export async function adminListDiscounts() {
  return authApiFetch<{ count: number; results: BackendDiscount[] }>("/promotions/admin/discounts/");
}

export async function adminCreateDiscount(data: BackendDiscount) {
  return authApiFetch<BackendDiscount>("/promotions/admin/discounts/", { method: "POST", body: jsonBody(data) });
}

export async function adminGetDiscount(discountId: number) {
  return authApiFetch<BackendDiscount>(`/promotions/admin/discounts/${discountId}/`);
}

export async function adminUpdateDiscount(discountId: number, data: BackendDiscount) {
  return authApiFetch<BackendDiscount>(`/promotions/admin/discounts/${discountId}/`, { method: "PUT", body: jsonBody(data) });
}

export async function adminPatchDiscount(discountId: number, data: Partial<BackendDiscount>) {
  return authApiFetch<BackendDiscount>(`/promotions/admin/discounts/${discountId}/`, { method: "PATCH", body: jsonBody(data) });
}

export async function adminDeleteDiscount(discountId: number) {
  return authApiFetch(`/promotions/admin/discounts/${discountId}/`, { method: "DELETE" });
}

// NOTE: /catalog/admin/discounts/ is a duplicate of /promotions/admin/discounts/.
// We use /promotions/admin/discounts/ as the main one (see INTEGRATION_TODO.md).

// ---- Customers admin ----

export async function adminListCustomers() {
  return authApiFetch<{ count: number; results: BackendAdminCustomerList[] }>("/customers/");
}

export async function adminGetCustomer(userId: number) {
  return authApiFetch<BackendAdminCustomerDetail>(`/customers/${userId}/`);
}

// ---- Services admin ----

export async function adminListServices() {
  return authApiFetch<{ count: number; results: BackendService[] }>("/services/admin/");
}

export async function adminGetService(serviceId: number) {
  return authApiFetch<BackendService>(`/services/admin/${serviceId}/`);
}

export async function adminPatchService(serviceId: number, data: PatchedAdminServiceUpdate) {
  return authApiFetch<BackendService>(`/services/admin/${serviceId}/`, { method: "PATCH", body: jsonBody(data) });
}

// ---- Orders admin ----

export async function adminListOrders() {
  return authApiFetch<{ count: number; results: { order_id: number; customer_name: string; customer_email: string; order_date: string; status: string; status_display: string; total_amount: string; total_items: number }[] }>("/orders/admin/all/");
}

export async function adminPatchOrderStatus(orderId: number, status: string) {
  return authApiFetch(`/orders/admin/${orderId}/status/`, { method: "PATCH", body: jsonBody({ status }) });
}

