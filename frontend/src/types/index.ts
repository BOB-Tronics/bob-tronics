export type CategorySlug = "phones" | "laptops" | "accessories" | "gaming";

export type StockStatus = "in-stock" | "low-stock" | "pre-order";

export interface Category {
  slug: CategorySlug;
  backendId?: number;
  name: string;
  tagline: string;
  image: string;
  count: number;
  subcategories: string[];
}

export interface ProductOption {
  label: string;
  price: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
}

export interface Faq {
  question: string;
  answer: string;
}

// Active promotion applied to a product (from /promotions/active/ or /promotions/products/{id}/).
export interface ProductDiscount {
  discountedPrice: number;
  savings: number;
  discountType: string;
  discountValue: number;
  endDate: string | null;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  price: number;
  discount?: ProductDiscount;
  summary: string;
  tagline: string;
  description: string;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: StockStatus;
  stockCount: number;
  sku: string;
  warranty: string;
  finishes: string[];
  configurations: ProductOption[];
  highlights: { value: string; label: string }[];
  specs: { label: string; value: string }[];
  included: string[];
  reviews: Review[];
  faqs: Faq[];
  trending?: boolean;
  newArrival?: boolean;
  featured?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  finish?: string;
  configuration?: string;
}

export type OrderStatus = "Processing" | "Packed" | "Out for delivery" | "Delivered" | "Cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  variant: string;
  quantity: number;
  price: number;
  image: string;
}

export interface TimelineStep {
  title: string;
  time: string;
  note: string;
  state: "done" | "current" | "pending";
}

export interface Order {
  id: string;
  date: string;
  placedAt: string;
  estimatedDelivery: string;
  status: OrderStatus;
  paymentStatus: string;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  discount: number;
  discountCode?: string;
  total: number;
  deliveryMethod: string;
  paymentMethod: string;
  paymentReference: string;
  timeline: TimelineStep[];
  // Raw backend values shown on the order detail page.
  shippingAddress?: string;
  phone?: string;
  rawStatus?: string;
  deliveryStatus?: string;
}

export interface Address {
  id: string;
  label: string;
  recipient: string;
  street: string;
  city: string;
  code: string;
  phone: string;
  isDefault: boolean;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  residence?: string;
}

export interface ServiceRequest {
  id: string;
  service: string;
  status: string;
  date: string;
  location: string;
  description?: string;
  serviceType?: string;
  estimatedCost?: string | null;
  finalCost?: string | null;
}

export interface ItService {
  id: string;
  name: string;
  description: string;
  icon: "consulting" | "support" | "network" | "repair";
}

export interface Testimonial {
  id: string;
  author: string;
  text: string;
  rating: number;
}

// The account UI uses a separate camel-case User view model above.
// UNVERIFIED: confirm login and /accounts/me/ against the real backend in-browser.
export type UserRole = "customer" | "admin" | "super_admin";

export interface BackendUser {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone: string;
  residence: string;
  created_at: string;
  is_active?: boolean;
  last_login?: string | null;
}

export type BackendUserProfile = BackendUser;

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  message: string;
  user: BackendUser;
  tokens: TokenResponse;
}
export interface RegisterInput {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirm: string;
  phone?: string;
  residence?: string;
}

export interface ActivationInput {
  uid: string;
  token: string;
}

export interface PasswordResetInput {
  email: string;
}

export interface PasswordResetConfirmInput {
  uid: string;
  token: string;
  new_password: string;
  password_confirm: string;
}

export interface MessageResponse {
  message: string;
}

// ---- Backend cart types (UNVERIFIED) ----

export interface BackendCartItem {
  cart_item_id: number;
  product: {
    product_id: number;
    name: string;
    brand: string;
    price: string;
    stock_quantity: number;
    is_available: boolean;
    category_name: string;
  };
  quantity: number;
  subtotal: string;
  is_in_stock: boolean;
  added_at: string;
}

export interface CartItemAddInput {
  product_id: number;
  quantity?: number;
}

export interface PatchedCartItemUpdate {
  quantity: number;
}

// ---- Backend wishlist types (UNVERIFIED) ----

export interface BackendWishlistItem {
  wishlist_item_id: number;
  product: {
    product_id: number;
    name: string;
    brand: string;
    price: string;
    stock_quantity: number;
    is_available: boolean;
    category_name: string;
    is_in_stock: boolean;
  };
  added_at: string;
}

export interface WishlistItemAddInput {
  product_id: number;
}

// ---- Backend order types (verified live for list, detail, checkout, delivery, and status fields) ----

export interface BackendOrderItem {
  order_item_id: number;
  product: {
    product_id: number;
    name: string;
    brand: string;
    category_name: string;
  };
  quantity: number;
  unit_price: string;
  discount_amount: string;
  subtotal: string;
}

export interface BackendOrderList {
  order_id: number;
  customer_email: string;
  customer_name?: string;
  order_date: string;
  status: string;
  status_display: string;
  total_amount: string;
  total_items: number;
  shipping_address: string;
  phone: string;
  payment_status?: string;
  payment_method?: string;
  payment_reference?: string;
  delivery_status?: string;
  delivery?: BackendOrderDelivery | string | null;
  estimated_delivery?: string | null;
  created_at: string;
}

export interface BackendOrder {
  order_id: number;
  customer_email: string;
  customer_name: string;
  order_date: string;
  status: string;
  status_display: string;
  total_amount: string;
  shipping_address: string;
  phone: string;
  payment_status?: string;
  payment_method?: string;
  payment_reference?: string;
  delivery_status?: string;
  estimated_delivery?: string | null;
  items: BackendOrderItem[];
  delivery: BackendOrderDelivery | string | null;
  created_at: string;
  updated_at: string;
}

export interface BackendOrderDelivery {
  delivery_id?: number;
  delivery_method?: string;
  delivery_method_display?: string;
  status?: string;
  status_display?: string;
  estimated_delivery?: string | null;
  tracking_number?: string | null;
}

export interface OrderCheckoutInput {
  shipping_address?: string;
  phone?: string;
  delivery_method?: "standard" | "express" | "store_pickup";
}

// ---- Backend service types (UNVERIFIED) ----

export interface BackendService {
  service_id: number;
  user_id: number;
  customer_email: string;
  name: string;
  description: string;
  service_type: string;
  service_type_display: string;
  status: string;
  status_display: string;
  estimated_cost: string | null;
  final_cost: string | null;
  requested_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceCreateInput {
  name: string;
  description: string;
  service_type: string;
}

export interface PatchedAdminServiceUpdate {
  status: string;
  estimated_cost?: string | null;
  final_cost?: string | null;
}

// ---- Backend review types (UNVERIFIED) ----

export interface BackendFeedback {
  feedback_id: number;
  user: number;
  product: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

// ---- Backend promotion types (UNVERIFIED) ----

export interface BackendActivePromotion {
  discount_id: number;
  product: {
    product_id: number;
    name: string;
    brand: string;
    price: string;
    category_name: string;
    is_available: boolean;
    primary_image: string | null;
  };
  discount_type: string;
  discount_type_display: string;
  discount_value: string;
  savings_amount: string;
  discounted_price: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface BackendProductDiscountDetail {
  has_discount: boolean;
  product_id: number;
  product_name: string;
  original_price: string;
  discount_type: string | null;
  discount_value: string | null;
  savings_amount: string;
  discounted_price: string;
  start_date: string | null;
  end_date: string | null;
}

// ---- Backend delivery types (UNVERIFIED) ----

export interface BackendDelivery {
  delivery_id: number;
  order: {
    order_id: number;
    customer_email: string;
    customer_name: string;
    order_status: string;
    total_amount: string;
  };
  delivery_address: string;
  delivery_method: string;
  delivery_method_display: string;
  tracking_number: string | null;
  status: string;
  status_display: string;
  shipping_fee: string;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BackendDeliveryTracking {
  tracking_number: string | null;
  order_id: number;
  status: string;
  status_display: string;
  delivery_method: string;
  delivery_method_display: string;
  delivery_address: string;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

// ---- Backend catalog admin types (UNVERIFIED) ----

export interface BackendCategory {
  category_id: number;
  name: string;
  description: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface BackendProduct {
  product_id: number;
  category: number;
  category_name: string;
  name: string;
  // UNVERIFIED: description/warranty/images are admin detail fields beyond the known public list contract.
  description?: string;
  brand: string;
  price: string;
  stock_quantity: number;
  warranty?: string;
  is_available: boolean;
  average_rating?: number | string;
  review_count?: number;
  primary_image?: string | null;
  images?: Array<{ image_id: number; image_url: string; is_primary: boolean }>;
  created_at?: string;
  updated_at?: string;
}

export interface BackendProductImage {
  image_id: number;
  product: number;
  image_url: string;
  is_primary: boolean;
  created_at: string;
}

export interface BackendDiscount {
  discount_id: number;
  product: number;
  discount_type: string;
  discount_value: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Body for creating/updating a discount via /promotions/admin/discounts/.
// VERIFIED live: "percentage" is accepted; other discount_type values remain unverified.
export interface DiscountInput {
  product: number;
  discount_type: string;
  discount_value: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface StockAdjustmentInput {
  delta: number;
  reason?: string;
}

// ---- Backend customer admin types (UNVERIFIED) ----

export interface BackendAdminCustomerList {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  residence: string;
  role: string;
  is_active: boolean;
  last_login: string | null;
  total_orders: number;
  created_at: string;
}

export interface BackendAdminCustomerDetail {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  residence: string;
  role: string;
  is_active: boolean;
  last_login: string | null;
  total_orders: number;
  total_spent: string;
  recent_orders: BackendOrderList[];
  created_at: string;
  updated_at: string;
}
