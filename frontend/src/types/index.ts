export type CategorySlug = "phones" | "laptops" | "accessories" | "gaming";

export type StockStatus = "in-stock" | "low-stock" | "pre-order";

export interface Category {
  slug: CategorySlug;
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

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  price: number;
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
  paymentStatus: "Paid" | "Pending";
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
}

export interface ServiceRequest {
  id: string;
  service: string;
  status: "Scheduled" | "Completed" | "Pending";
  date: string;
  location: string;
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
