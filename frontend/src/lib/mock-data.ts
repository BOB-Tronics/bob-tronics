// Development mock data. Shapes match what the backend is expected to return,
// so services can switch to real API calls without touching the UI.
import type {
  Address,
  Category,
  ItService,
  Order,
  Product,
  ServiceRequest,
  Testimonial,
  User,
} from "@/types";

export const categories: Category[] = [
  {
    slug: "phones",
    name: "Phones",
    tagline: "Latest smartphones",
    image: "/images/categories/phones.jpg",
    count: 48,
    subcategories: ["Apple iPhone", "Samsung Galaxy", "All smartphones"],
  },
  {
    slug: "laptops",
    name: "Laptops",
    tagline: "Built for performance",
    image: "/images/categories/laptops.jpg",
    count: 32,
    subcategories: ["MacBook", "Dell & HP", "Business laptops"],
  },
  {
    slug: "accessories",
    name: "Accessories",
    tagline: "Complete your setup",
    image: "/images/categories/accessories.jpg",
    count: 86,
    subcategories: ["Audio", "Chargers & cables", "Cases & protection"],
  },
  {
    slug: "gaming",
    name: "Gaming",
    tagline: "Play without limits",
    image: "/images/categories/gaming.jpg",
    count: 24,
    subcategories: ["PlayStation", "Controllers", "Games & accessories"],
  },
];

const defaultReviews = [
  {
    id: "r1",
    author: "Ama M.",
    rating: 5,
    date: "2026-10-02",
    text: "Arrived beautifully packed. The team helped me choose exactly what I needed.",
  },
  {
    id: "r2",
    author: "Kofi A.",
    rating: 5,
    date: "2026-09-28",
    text: "Genuine product and a smooth experience from checkout to delivery.",
  },
  {
    id: "r3",
    author: "Esi D.",
    rating: 5,
    date: "2026-09-24",
    text: "Great advice from the team and a smooth delivery experience.",
  },
];

const defaultFaqs = [
  {
    question: "Is this an original product?",
    answer: "Yes. Every device is verified, sealed stock with clear warranty coverage.",
  },
  {
    question: "Can you help me set it up?",
    answer: "Yes. Request setup support at checkout or book an IT service.",
  },
  {
    question: "How soon will it arrive?",
    answer: "Standard Kigali delivery takes 2-3 business days after payment confirmation.",
  },
];

export const products: Product[] = [
  {
    id: "p1",
    slug: "macbook-air-13-m3",
    name: 'MacBook Air 13" M3',
    brand: "Apple",
    category: "laptops",
    price: 14500,
    summary: "8GB RAM · 256GB SSD · Midnight",
    tagline: "Powerfully light. Beautifully capable.",
    description:
      "Apple M3 chip. 13.6-inch Liquid Retina display. Up to 18 hours of battery life. All in an incredibly portable design.",
    images: [
      "/images/products/macbook-air-m3.jpg",
      "/images/products/macbook-air-m3-2.jpg",
      "/images/products/macbook-air-m3-3.jpg",
      "/images/products/macbook-air-m3-4.jpg",
    ],
    rating: 4.9,
    reviewCount: 128,
    stock: "in-stock",
    stockCount: 18,
    sku: "BT-APL-M3-256",
    warranty: "1-year limited warranty",
    finishes: ["Midnight", "Starlight", "Silver"],
    configurations: [
      { label: "8GB / 256GB", price: 14500 },
      { label: "16GB / 512GB", price: 18900 },
    ],
    highlights: [
      { value: "M3", label: "Fast. Efficient. Effortless." },
      { value: "18 hrs", label: "Battery that goes the distance." },
      { value: "1.24 kg", label: "Take your work anywhere." },
    ],
    specs: [
      { label: "Chip", value: "Apple M3 · 8-core CPU · 8-core GPU" },
      { label: "Memory", value: "8GB unified memory" },
      { label: "Storage", value: "256GB SSD" },
      { label: "Display", value: "13.6-inch Liquid Retina · 2560 × 1664" },
      { label: "Ports", value: "2× Thunderbolt / USB 4 · MagSafe 3 · 3.5mm" },
      { label: "Battery", value: "Up to 18 hours" },
      { label: "Operating system", value: "macOS" },
      { label: "Warranty", value: "1-year limited warranty" },
    ],
    included: [
      'MacBook Air 13" M3',
      "30W USB-C Power Adapter",
      "USB-C to MagSafe 3 Cable (2m)",
      "Documentation",
    ],
    reviews: defaultReviews,
    faqs: defaultFaqs,
    trending: true,
    featured: true,
  },
  {
    id: "p2",
    slug: "iphone-15-pro",
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "phones",
    price: 12800,
    summary: "256GB · Natural titanium",
    tagline: "Titanium. So strong. So light. So Pro.",
    description:
      "A17 Pro chip, a customizable Action button and the most powerful iPhone camera system yet, in aerospace-grade titanium.",
    images: ["/images/products/iphone-15-pro.jpg"],
    rating: 4.9,
    reviewCount: 128,
    stock: "in-stock",
    stockCount: 12,
    sku: "BT-APL-15P-256",
    warranty: "1-year limited warranty",
    finishes: ["Natural titanium", "Blue titanium", "Black titanium"],
    configurations: [
      { label: "256GB", price: 12800 },
      { label: "512GB", price: 14900 },
    ],
    highlights: [
      { value: "A17 Pro", label: "Game-changing chip." },
      { value: "48MP", label: "Pro camera system." },
      { value: "Titanium", label: "Strong and light." },
    ],
    specs: [
      { label: "Chip", value: "A17 Pro" },
      { label: "Storage", value: "256GB" },
      { label: "Display", value: "6.1-inch Super Retina XDR" },
      { label: "Camera", value: "48MP main · 12MP ultra wide · 12MP telephoto" },
      { label: "Warranty", value: "1-year limited warranty" },
    ],
    included: ["iPhone 15 Pro", "USB-C Charge Cable (1m)", "Documentation"],
    reviews: defaultReviews,
    faqs: defaultFaqs,
    trending: true,
    newArrival: true,
  },
  {
    id: "p3",
    slug: "playstation-5-slim",
    name: "PlayStation 5 Slim",
    brand: "Sony",
    category: "gaming",
    price: 7200,
    summary: "1TB · Disc edition · DualSense",
    tagline: "Play has no limits.",
    description:
      "Lightning-fast loading, haptic feedback and adaptive triggers, with a 1TB SSD and the DualSense wireless controller.",
    images: ["/images/products/playstation-5-slim.jpg"],
    rating: 4.9,
    reviewCount: 128,
    stock: "in-stock",
    stockCount: 9,
    sku: "BT-SNY-PS5-1TB",
    warranty: "1-year limited warranty",
    finishes: ["White"],
    configurations: [
      { label: "Disc edition · 1TB", price: 7200 },
      { label: "Digital edition · 1TB", price: 6400 },
    ],
    highlights: [
      { value: "1TB", label: "Room for your library." },
      { value: "4K", label: "Stunning visuals." },
      { value: "120fps", label: "Ultra-smooth play." },
    ],
    specs: [
      { label: "Storage", value: "1TB SSD" },
      { label: "Output", value: "Up to 4K · 120Hz" },
      { label: "Controller", value: "DualSense wireless controller" },
      { label: "Warranty", value: "1-year limited warranty" },
    ],
    included: ["PlayStation 5 Slim console", "DualSense controller", "HDMI cable", "Power cable"],
    reviews: defaultReviews,
    faqs: defaultFaqs,
    trending: true,
    featured: true,
  },
  {
    id: "p4",
    slug: "wh-1000xm5",
    name: "WH-1000XM5",
    brand: "Sony",
    category: "accessories",
    price: 3800,
    summary: "Wireless · Noise cancelling",
    tagline: "Silence everything but your music.",
    description:
      "Industry-leading noise cancellation, crystal-clear calls and up to 30 hours of battery life.",
    images: ["/images/products/wh-1000xm5.jpg"],
    rating: 4.9,
    reviewCount: 128,
    stock: "in-stock",
    stockCount: 25,
    sku: "BT-SNY-XM5",
    warranty: "1-year limited warranty",
    finishes: ["Black", "Silver"],
    configurations: [{ label: "Standard", price: 3800 }],
    highlights: [
      { value: "30 hrs", label: "All-day battery." },
      { value: "8 mics", label: "Clear calls anywhere." },
      { value: "250 g", label: "Light and comfortable." },
    ],
    specs: [
      { label: "Type", value: "Over-ear · Wireless" },
      { label: "Battery", value: "Up to 30 hours" },
      { label: "Connectivity", value: "Bluetooth 5.2 · 3.5mm" },
      { label: "Warranty", value: "1-year limited warranty" },
    ],
    included: ["WH-1000XM5 headphones", "Carry case", "USB-C cable", "Audio cable"],
    reviews: defaultReviews,
    faqs: defaultFaqs,
    trending: true,
    newArrival: true,
    featured: true,
  },
  {
    id: "p5",
    slug: "dell-xps-13",
    name: "Dell XPS 13",
    brand: "Dell",
    category: "laptops",
    price: 16900,
    summary: "16GB RAM · 512GB SSD",
    tagline: "Small size. Big performance.",
    description:
      "Intel Core i7, a stunning InfinityEdge display and a machined aluminium body built for work on the move.",
    images: ["/images/products/dell-xps-13.jpg"],
    rating: 4.9,
    reviewCount: 128,
    stock: "in-stock",
    stockCount: 6,
    sku: "BT-DEL-XPS13",
    warranty: "1-year limited warranty",
    finishes: ["Platinum", "Graphite"],
    configurations: [
      { label: "16GB / 512GB", price: 16900 },
      { label: "32GB / 1TB", price: 21500 },
    ],
    highlights: [
      { value: "i7", label: "13th Gen Intel Core." },
      { value: "13.4\"", label: "InfinityEdge display." },
      { value: "1.17 kg", label: "Light enough for anywhere." },
    ],
    specs: [
      { label: "Processor", value: "Intel Core i7" },
      { label: "Memory", value: "16GB" },
      { label: "Storage", value: "512GB SSD" },
      { label: "Display", value: "13.4-inch FHD+ InfinityEdge" },
      { label: "Warranty", value: "1-year limited warranty" },
    ],
    included: ["Dell XPS 13", "45W USB-C adapter", "Documentation"],
    reviews: defaultReviews,
    faqs: defaultFaqs,
    newArrival: true,
    featured: true,
  },
  {
    id: "p6",
    slug: "galaxy-s24-ultra",
    name: "Galaxy S24 Ultra",
    brand: "Samsung",
    category: "phones",
    price: 13200,
    summary: "256GB · Titanium gray",
    tagline: "Galaxy AI is here.",
    description:
      "A 200MP camera, built-in S Pen and a titanium frame, powered by Galaxy AI.",
    images: ["/images/products/galaxy-s24-ultra.jpg"],
    rating: 4.9,
    reviewCount: 128,
    stock: "low-stock",
    stockCount: 2,
    sku: "BT-SAM-S24U-256",
    warranty: "1-year limited warranty",
    finishes: ["Titanium gray", "Titanium black", "Titanium violet"],
    configurations: [
      { label: "256GB", price: 13200 },
      { label: "512GB", price: 14800 },
    ],
    highlights: [
      { value: "200MP", label: "Incredible detail." },
      { value: "S Pen", label: "Built in." },
      { value: "6.8\"", label: "QHD+ display." },
    ],
    specs: [
      { label: "Storage", value: "256GB" },
      { label: "Display", value: "6.8-inch QHD+ Dynamic AMOLED 2X" },
      { label: "Camera", value: "200MP main" },
      { label: "Warranty", value: "1-year limited warranty" },
    ],
    included: ["Galaxy S24 Ultra", "S Pen", "USB-C cable", "Documentation"],
    reviews: defaultReviews,
    faqs: defaultFaqs,
    newArrival: true,
  },
];

export const currentUser: User = {
  firstName: "Ama",
  lastName: "Mensah",
  email: "ama.mensah@example.com",
  phone: "+250 78 855 0184",
};

export const addresses: Address[] = [
  {
    id: "a1",
    label: "Home",
    recipient: "Ama Mensah",
    street: "KG 7 Avenue, Kimihurura",
    city: "Kigali",
    code: "Gasabo",
    phone: "+250 78 855 0184",
    isDefault: true,
  },
];

export const orders: Order[] = [
  {
    id: "BT-10482",
    date: "2026-10-01",
    placedAt: "01 Oct 2026 · 14:32",
    estimatedDelivery: "2026-10-03",
    status: "Packed",
    paymentStatus: "Paid",
    items: [
      {
        productId: "p1",
        name: 'MacBook Air 13" M3',
        variant: "Midnight · 8GB / 256GB",
        quantity: 1,
        price: 14500,
        image: "/images/products/macbook-air-m3.jpg",
      },
    ],
    subtotal: 14500,
    delivery: 80,
    discount: 500,
    discountCode: "WELCOME500",
    total: 14080,
    deliveryMethod: "Standard Delivery",
    paymentMethod: "MTN MoMo · +250 78 ••• 0184",
    paymentReference: "MM-882140",
    timeline: [
      { title: "Confirmed", time: "01 Oct · 14:32", note: "Payment received", state: "done" },
      { title: "Processing", time: "01 Oct · 15:10", note: "Order verified by our team", state: "done" },
      { title: "Packed", time: "02 Oct · 09:15", note: "Your device is safely packed", state: "current" },
      {
        title: "Out for Delivery",
        time: "Expected 03 Oct · 09:00",
        note: "Courier assignment pending",
        state: "pending",
      },
      { title: "Delivered", time: "Expected 03 Oct", note: "Not yet delivered", state: "pending" },
    ],
  },
  {
    id: "BT-10211",
    date: "2026-09-12",
    placedAt: "12 Sep 2026 · 10:05",
    estimatedDelivery: "2026-09-14",
    status: "Delivered",
    paymentStatus: "Paid",
    items: [
      {
        productId: "p4",
        name: "WH-1000XM5",
        variant: "Black",
        quantity: 1,
        price: 3800,
        image: "/images/products/wh-1000xm5.jpg",
      },
    ],
    subtotal: 3800,
    delivery: 80,
    discount: 0,
    total: 3880,
    deliveryMethod: "Standard Delivery",
    paymentMethod: "MTN MoMo · +250 78 ••• 0184",
    paymentReference: "MM-871022",
    timeline: [
      { title: "Confirmed", time: "12 Sep · 10:05", note: "Payment received", state: "done" },
      { title: "Processing", time: "12 Sep · 11:40", note: "Order verified by our team", state: "done" },
      { title: "Packed", time: "13 Sep · 08:30", note: "Your device is safely packed", state: "done" },
      { title: "Out for Delivery", time: "14 Sep · 09:00", note: "Courier on the way", state: "done" },
      { title: "Delivered", time: "14 Sep · 13:20", note: "Signed for by Ama", state: "done" },
    ],
  },
  {
    id: "BT-10039",
    date: "2026-08-28",
    placedAt: "28 Aug 2026 · 16:48",
    estimatedDelivery: "2026-08-30",
    status: "Delivered",
    paymentStatus: "Paid",
    items: [
      {
        productId: "p2",
        name: "iPhone 15 Pro",
        variant: "Natural titanium · 256GB",
        quantity: 1,
        price: 12800,
        image: "/images/products/iphone-15-pro.jpg",
      },
    ],
    subtotal: 12800,
    delivery: 80,
    discount: 0,
    total: 12880,
    deliveryMethod: "Standard Delivery",
    paymentMethod: "Visa •••• 4412",
    paymentReference: "CARD-660194",
    timeline: [
      { title: "Confirmed", time: "28 Aug · 16:48", note: "Payment received", state: "done" },
      { title: "Processing", time: "28 Aug · 17:30", note: "Order verified by our team", state: "done" },
      { title: "Packed", time: "29 Aug · 09:00", note: "Your device is safely packed", state: "done" },
      { title: "Out for Delivery", time: "30 Aug · 08:45", note: "Courier on the way", state: "done" },
      { title: "Delivered", time: "30 Aug · 12:10", note: "Signed for by Ama", state: "done" },
    ],
  },
];

export const wishlistProductIds = ["p2", "p3", "p4"];

export const serviceRequests: ServiceRequest[] = [
  {
    id: "BT-SR-2041",
    service: "Network & Setup",
    status: "Scheduled",
    date: "06 Oct 2026 · 10:00 AM",
    location: "Kimihurura, Kigali",
  },
];

export const itServices: ItService[] = [
  {
    id: "s1",
    name: "IT Consulting",
    description: "A clear technology roadmap for your business.",
    icon: "consulting",
  },
  {
    id: "s2",
    name: "Technical Support",
    description: "Fast, friendly help when you need it most.",
    icon: "support",
  },
  {
    id: "s3",
    name: "Network & Setup",
    description: "Connected offices, secure networks, seamless work.",
    icon: "network",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    author: "Ama M.",
    rating: 5,
    text: "My MacBook arrived beautifully packed. The team helped me choose exactly what I needed.",
  },
  {
    id: "t2",
    author: "Kofi A.",
    rating: 5,
    text: "Genuine products and clear updates from checkout to delivery. A store I can trust.",
  },
  {
    id: "t3",
    author: "Nana E.",
    rating: 5,
    text: "Our office network is finally reliable. Professional, thoughtful IT support.",
  },
];

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

export const promotions: Promotion[] = [
  {
    id: "promo-1",
    productId: "p1",
    productName: 'MacBook Air 13" M3',
    brand: "Apple",
    category: "laptops",
    discountType: "percentage",
    discountValue: 10,
    originalPrice: 14500,
    discountedPrice: 13050,
    savings: 1450,
    startDate: "2026-10-01",
    endDate: "2026-10-31",
    isActive: true,
  },
];
