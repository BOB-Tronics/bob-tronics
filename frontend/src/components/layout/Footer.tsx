"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const footerColumns = [
  {
    title: "Shop",
    links: [
      { label: "Phones", href: "/shop?category=phones" },
      { label: "Laptops", href: "/shop?category=laptops" },
      { label: "Accessories", href: "/shop?category=accessories" },
      { label: "Gaming", href: "/shop?category=gaming" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Track Order", href: "/account/orders" },
      { label: "IT Services", href: "/it-services" },
      { label: "Returns & warranty", href: "/contact" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Privacy policy", href: "/about" },
      { label: "Terms of service", href: "/about" },
      { label: "FAQs", href: "/contact" },
    ],
  },
];

const compactLinks = ["Support", "Returns & warranty", "Privacy", "Terms", "Secure payments"];

// The home page gets the full footer; every other page uses the compact bar.
export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/sign-in" || pathname === "/sign-up") return null;

  if (pathname !== "/") {
    return (
      <footer className="mt-12 bg-[#080E28] text-sm text-white/80">
        <div className="page-container flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p>BOB TRONICS· © 2026 · Demo design</p>
          <p className="flex flex-wrap gap-x-1">
            {compactLinks.map((label, index) => (
              <span key={label}>
                {index > 0 && " · "}
                <Link href="/contact" className="hover:text-white">
                  {label}
                </Link>
              </span>
            ))}
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-16 bg-navy text-white">
      <div className="page-container py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <p className="text-2xl font-extrabold tracking-tight">BOB TRONICS</p>
            <p className="mt-4 text-white/80">Your next upgrade. Your trusted technology partner.</p>
            <p className="mt-3 text-xs text-white/60">
              Illustrative demo store · Contact details are examples.
            </p>
          </div>
          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="font-semibold">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-white/75 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 BOB TRONICS. Demo design.</p>
          <p>Mobile Money. Visa· Mastercard· Secure checkout</p>
        </div>
      </div>
    </footer>
  );
}

