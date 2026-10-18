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
  DiscountInput,
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

// UNVERIFIED: response aliases are defensive guesses until checked against real admin responses.
type AdminRecord = Record<string, unknown>;
export interface AdminListResult<T> { results: T[]; count: number | null }
export interface AdminOrderLine { name: string; sku: string; quantity: string; unitPrice: string; subtotal: string }
export interface AdminOrderRow { id: string; orderId: number | null; customerName: string; customerEmail: string; orderDate: string; totalAmount: string; totalItems: string; status: string; statusDisplay: string; paymentStatus: string; deliveryStatus: string; shippingAddress: string; phone: string; deliveryMethod: string; createdAt: string; updatedAt: string; items: AdminOrderLine[] }
export interface AdminCustomerRow { id: number | null; name: string; email: string; phone: string; residence: string; orders: string; totalSpent: string; createdAt: string; lastActive: string; role: string; isActive: string; recentOrders: AdminOrderRow[] }
export interface AdminServiceRow { id: number | null; customerId: number | null; customerName: string; customerEmail: string; service: string; description: string; status: string; requestedAt: string; appointment: string; estimatedCost: string; finalCost: string }
function asRecord(value: unknown): AdminRecord { return typeof value === "object" && value !== null && !Array.isArray(value) ? value as AdminRecord : {}; }
function asText(value: unknown): string | null { return typeof value === "string" || typeof value === "number" ? String(value) : null; }
function pickText(row: AdminRecord, keys: string[]): string { for (const key of keys) { const value=asText(row[key]); if(value!==null&&value.trim()!=="") return value; } return "—"; }
function pickId(row: AdminRecord, keys: string[]): number | null { for(const key of keys){const value=row[key];const id=typeof value==="number"?value:typeof value==="string"?Number(value):NaN;if(Number.isFinite(id))return id;}return null; }
function listEnvelope(payload: unknown): { items: AdminRecord[]; count: number | null } { if(Array.isArray(payload))return {items:payload.map(asRecord),count:payload.length};const row=asRecord(payload);const values=Array.isArray(row.results)?row.results:Array.isArray(row.data)?row.data:[];return {items:values.map(asRecord),count:typeof row.count==="number"&&Number.isFinite(row.count)?row.count:null}; }
// TEMPORARY: remove after verification. Log keys only; never log response values or personal data.
function logAdminShape(endpoint: string,payload:unknown,method="GET"){if(process.env.NODE_ENV!=="development")return;const envelope=asRecord(payload);const first=Array.isArray(payload)?asRecord(payload[0]):Array.isArray(envelope.results)?asRecord(envelope.results[0]):Array.isArray(envelope.data)?asRecord(envelope.data[0]):envelope;const keys=Object.keys(first);if(keys.length)console.info(`[shape] ${method} ${endpoint} -> ${keys.join(", ")}`);}
function mapOrderLine(value:unknown):AdminOrderLine{const row=asRecord(value);const product=asRecord(row.product);return {name:pickText(product,["name","product_name"])!=="—"?pickText(product,["name","product_name"]):pickText(row,["name","product_name"]),sku:pickText(product,["sku","product_sku"])!=="—"?pickText(product,["sku","product_sku"]):pickText(row,["sku","product_sku"]),quantity:pickText(row,["quantity","qty"]),unitPrice:pickText(row,["unit_price","price"]),subtotal:pickText(row,["subtotal","total","line_total"])};}
function mapOrder(value:unknown):AdminOrderRow{const row=asRecord(value);const customer=asRecord(row.customer);const rawItems=Array.isArray(row.items)?row.items:Array.isArray(row.order_items)?row.order_items:[];const id=pickId(row,["order_id","id"]);const name=pickText(row,["customer_name","full_name"]);return {id:id===null?pickText(row,["order_number","reference"]):String(id),orderId:id,customerName:name!=="—"?name:pickText(customer,["name","full_name"]),customerEmail:pickText(row,["customer_email","email"])!=="—"?pickText(row,["customer_email","email"]):pickText(customer,["email"]),orderDate:pickText(row,["order_date","created_at","date"]),totalAmount:pickText(row,["total_amount","total","amount"]),totalItems:pickText(row,["total_items","item_count"]),status:pickText(row,["status","order_status"]),statusDisplay:pickText(row,["status_display","order_status_display","status","order_status"]),paymentStatus:pickText(row,["payment_status","payment_status_display"]),deliveryStatus:pickText(row,["delivery_status","delivery_status_display","delivery"]),shippingAddress:pickText(row,["shipping_address","delivery_address","address"]),phone:pickText(row,["phone","customer_phone"]),deliveryMethod:pickText(row,["delivery_method","shipping_method"]),createdAt:pickText(row,["created_at","order_date"]),updatedAt:pickText(row,["updated_at"]),items:rawItems.map(mapOrderLine)};}
function mapCustomer(value:unknown):AdminCustomerRow{const row=asRecord(value);const first=pickText(row,["first_name"]);const last=pickText(row,["last_name"]);const full=pickText(row,["name","customer_name","full_name"]);return {id:pickId(row,["user_id","customer_id","id"]),name:full!=="—"?full:[first,last].filter(x=>x!=="—").join(" ")||"—",email:pickText(row,["email","customer_email"]),phone:pickText(row,["phone"]),residence:pickText(row,["residence","address"]),orders:pickText(row,["total_orders","order_count","orders_count"]),totalSpent:pickText(row,["total_spent","total_amount_spent"]),createdAt:pickText(row,["created_at","date_joined"]),lastActive:pickText(row,["last_active","last_login"]),role:pickText(row,["role"]),isActive:typeof row.is_active==="boolean"?(row.is_active?"Active":"Inactive"):pickText(row,["status"]),recentOrders:Array.isArray(row.recent_orders)?row.recent_orders.map(mapOrder):[]};}
function unwrapDetail(payload:unknown,wrapper:string):unknown{const row=asRecord(payload);return row.data??row.result??row[wrapper]??payload;}
function mapService(value:unknown):AdminServiceRow{const row=asRecord(value);const customer=asRecord(row.user??row.customer);const name=pickText(row,["customer_name","user_name"]);const email=pickText(row,["customer_email","email"]);return {id:pickId(row,["service_id","request_id","id"]),customerId:pickId(row,["user_id","customer_id"])??pickId(customer,["user_id","customer_id","id"]),customerName:name!=="—"?name:pickText(customer,["name","full_name"]),customerEmail:email!=="—"?email:pickText(customer,["email"]),service:pickText(row,["service_type_display","service_type","name","title"]),description:pickText(row,["description","details"]),status:pickText(row,["status_display","status","request_status"]),requestedAt:pickText(row,["requested_at","created_at","date"]),appointment:pickText(row,["appointment_at","appointment_date","scheduled_at"]),estimatedCost:pickText(row,["estimated_cost","estimated_fee"]),finalCost:pickText(row,["final_cost","actual_cost"])};}
function jsonBody(data: unknown) {
  return JSON.stringify(data);
}

// ---- Catalog admin ----
// UNVERIFIED: confirm the image endpoint response fields; the backend requires image_url in the create request.

export type CatalogList<T> = T[] | { count: number; next: string | null; previous: string | null; results: T[] };

function listResults<T>(response: CatalogList<T> | null): T[] {
  if (!response) return [];
  return Array.isArray(response) ? response : response.results;
}

export function adminErrorMessage(error: unknown): string {
  if (error instanceof Error && "status" in error && error.status === 403) {
    return "You don't have permission to make this change.";
  }
  if (error instanceof Error && "status" in error && error.status === 400) {
    return "Please check the highlighted fields and try again.";
  }
  return "Something went wrong. Please try again.";
}

export function adminFieldErrors(error: unknown): Record<string, string> {
  if (!(error instanceof Error) || !("data" in error)) return {};
  const data = error.data as {
    details?: unknown;
    error?: { details?: unknown };
  } | undefined;
  const details = data?.details ?? data?.error?.details;
  if (typeof details !== "object" || details === null || Array.isArray(details)) return {};

  const fields: Record<string, string> = {};
  for (const [field, value] of Object.entries(details)) {
    if (typeof value === "string") fields[field] = value;
    else if (Array.isArray(value) && typeof value[0] === "string") fields[field] = value[0];
  }
  return fields;
}

// UNVERIFIED: minimal category body inferred from the supplied Category shape.
export async function adminListCategories() {
  return listResults(await authApiFetch<CatalogList<BackendCategory>>("/catalog/admin/categories/"));
}

export async function adminCreateCategory(data: Pick<BackendCategory, "name" | "description" | "image">) {
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

export async function adminListImages(params?: { product?: number; is_primary?: boolean }) {
  const query = new URLSearchParams();
  if (params?.product !== undefined) query.set("product", String(params.product));
  if (params?.is_primary !== undefined) query.set("is_primary", String(params.is_primary));
  const path = query.toString() ? `/catalog/admin/images/?${query.toString()}` : "/catalog/admin/images/";
  return listResults(await authApiFetch<CatalogList<BackendProductImage>>(path));
}

// The backend requires an image_url string; this endpoint does not accept raw file uploads.
export interface AdminCreateImageInput {
  product: number;
  image_url: string;
  is_primary: boolean;
}

export async function adminCreateImage(data: AdminCreateImageInput) {
  return authApiFetch<BackendProductImage>("/catalog/admin/images/", {
    method: "POST",
    body: JSON.stringify(data),
  });
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

// UNVERIFIED: product create body uses fields already present in the admin form and BackendProduct type.
export async function adminListProducts() {
  return listResults(await authApiFetch<CatalogList<BackendProduct>>("/catalog/admin/products/"));
}

export async function adminCreateProduct(data: Pick<BackendProduct, "category" | "name" | "description" | "brand" | "price" | "stock_quantity" | "warranty" | "is_available">) {
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

// UNVERIFIED: threshold=5 is accepted, but the intended business cutoff and comparison rule are unknown.
const ADMIN_LOW_STOCK_THRESHOLD=5;
export async function adminLowStock() {
  const endpoint=`/catalog/admin/products/low-stock/?threshold=${ADMIN_LOW_STOCK_THRESHOLD}`;
  const response=await authApiFetch<CatalogList<BackendProduct>>(endpoint);
  logAdminShape(endpoint,response);
  return listResults(response);
}
export async function adminLowStockCount():Promise<number|null>{
  const endpoint=`/catalog/admin/products/low-stock/?threshold=${ADMIN_LOW_STOCK_THRESHOLD}`;
  const response=await authApiFetch<unknown>(endpoint);
  logAdminShape(endpoint,response);
  const list=listEnvelope(response);
  return list.count??list.items.length;
}
// ---- Discounts admin (main: /promotions/admin/discounts/) ----

// UNVERIFIED: list may be paginated or a plain array; both are handled.
export async function adminListDiscounts() {
  return listResults(await authApiFetch<CatalogList<BackendDiscount>>("/promotions/admin/discounts/"));
}

export async function adminCreateDiscount(data: DiscountInput) {
  return authApiFetch<BackendDiscount>("/promotions/admin/discounts/", { method: "POST", body: jsonBody(data) });
}

export async function adminGetDiscount(discountId: number) {
  return authApiFetch<BackendDiscount>(`/promotions/admin/discounts/${discountId}/`);
}

export async function adminUpdateDiscount(discountId: number, data: DiscountInput) {
  return authApiFetch<BackendDiscount>(`/promotions/admin/discounts/${discountId}/`, { method: "PUT", body: jsonBody(data) });
}

export async function adminPatchDiscount(discountId: number, data: Partial<DiscountInput>) {
  return authApiFetch<BackendDiscount>(`/promotions/admin/discounts/${discountId}/`, { method: "PATCH", body: jsonBody(data) });
}

export async function adminDeleteDiscount(discountId: number) {
  return authApiFetch(`/promotions/admin/discounts/${discountId}/`, { method: "DELETE" });
}

// NOTE: /catalog/admin/discounts/ is a duplicate of /promotions/admin/discounts/.
// We use /promotions/admin/discounts/ as the main one (see INTEGRATION_TODO.md).

// ---- Customers admin ----
export async function adminListCustomers():Promise<AdminListResult<AdminCustomerRow>>{const endpoint="/customers/";const response=await authApiFetch<unknown>(endpoint);logAdminShape(endpoint,response);const list=listEnvelope(response);return {results:list.items.map(mapCustomer),count:list.count};}
export async function adminGetCustomer(userId:number):Promise<AdminCustomerRow>{const endpoint=`/customers/${userId}/`;const response=await authApiFetch<unknown>(endpoint);logAdminShape(endpoint,response);return mapCustomer(unwrapDetail(response,"customer"));}

// ---- Services admin ----
export async function adminListServices():Promise<AdminListResult<AdminServiceRow>>{const endpoint="/services/admin/";const response=await authApiFetch<unknown>(endpoint);logAdminShape(endpoint,response);const list=listEnvelope(response);return {results:list.items.map(mapService),count:list.count};}
export async function adminGetService(serviceId:number):Promise<AdminServiceRow>{const endpoint=`/services/admin/${serviceId}/`;const response=await authApiFetch<unknown>(endpoint);logAdminShape(endpoint,response);return mapService(unwrapDetail(response,"service_request"));}
export async function adminPatchService(serviceId:number,data:PatchedAdminServiceUpdate):Promise<AdminServiceRow>{const endpoint=`/services/admin/${serviceId}/`;const response=await authApiFetch<unknown>(endpoint,{method:"PATCH",body:jsonBody(data)});logAdminShape(endpoint,response,"PATCH");return mapService(unwrapDetail(response,"service_request"));}

// ---- Orders admin ----
export async function adminListOrders():Promise<AdminListResult<AdminOrderRow>>{const endpoint="/orders/admin/all/";const response=await authApiFetch<unknown>(endpoint);logAdminShape(endpoint,response);const list=listEnvelope(response);return {results:list.items.map(mapOrder),count:list.count};}
export async function adminGetOrder(orderId:number):Promise<AdminOrderRow>{const endpoint=`/orders/${orderId}/`;const response=await authApiFetch<unknown>(endpoint);logAdminShape(endpoint,response);return mapOrder(unwrapDetail(response,"order"));}
export async function adminPatchOrderStatus(orderId:number,status:string):Promise<unknown>{const endpoint=`/orders/admin/${orderId}/status/`;const response=await authApiFetch<unknown>(endpoint,{method:"PATCH",body:jsonBody({status})});logAdminShape(endpoint,response,"PATCH");return response;}
