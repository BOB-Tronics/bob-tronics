import { delay } from "@/lib/api";
import {
  addresses,
  currentUser,
  itServices,
  orders,
  serviceRequests,
  testimonials,
  wishlistProductIds,
} from "@/lib/mock-data";
import type { Address, ItService, Order, ServiceRequest, Testimonial, User } from "@/types";

export async function getCurrentUser(): Promise<User> {
  return delay(currentUser);
}

export async function getOrders(): Promise<Order[]> {
  return delay(orders);
}

export async function getOrder(id: string): Promise<Order | undefined> {
  return delay(orders.find((o) => o.id === id));
}

export async function getAddresses(): Promise<Address[]> {
  return delay(addresses);
}

export async function getWishlistIds(): Promise<string[]> {
  return delay(wishlistProductIds);
}

export async function getServiceRequests(): Promise<ServiceRequest[]> {
  return delay(serviceRequests);
}

export async function getItServices(): Promise<ItService[]> {
  return delay(itServices);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return delay(testimonials);
}
