"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@/components/layout/Providers";
import { categories } from "@/lib/mock-data";
import { useCart } from "@/hooks/useCart";
import Button from "@/components/ui/Button";
import {
  ArrowRightIcon,
  CartIcon,
  ChevronDownIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
} from "@/components/ui/Icons";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "IT Services", href: "/it-services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { totalQuantity } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  // Categories come from GET /catalog/categories/ (empty until loaded or if the backend is down).
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let cancelled = false;
    getCategories()
      .then((list) => {
        if (!cancelled) setCategories(list);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (pathname === "/sign-in" || pathname === "/sign-up") return null;

  function closeMenus() {
    setMenuOpen(false);
    setCategoriesOpen(false);
  }

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  const iconButton =
    "flex h-10 w-10 items-center justify-center rounded-full text-primary hover:bg-accent";

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="bg-navy text-xs text-white/80">
      </div>

      <div className="page-container flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link href="/" className="flex items-center gap-2" aria-label="BOB TRONICS home">
          <Image src="/images/logo.png" alt="" width={48} height={47} className="h-10 w-auto lg:h-12" style={{ width: "auto" }} priority />
          <span className="leading-tight">
            <span className="block whitespace-nowrap text-base font-extrabold tracking-tight text-primary sm:text-lg lg:text-2xl">
              BOB TRONICS
            </span>
            <span className="hidden text-xs font-medium text-primary/80 sm:block lg:text-sm">
              A Technology Hub
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {navLinks.slice(0, 2).map((link) => (
            <NavLink key={link.href} {...link} active={isActive(link.href)} />
          ))}
          <div
            className="relative"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button
              className={`flex items-center gap-1 py-2 text-sm font-medium hover:text-primary ${
                categoriesOpen ? "text-primary" : "text-ink"
              }`}
              aria-expanded={categoriesOpen}
              onClick={() => setCategoriesOpen((open) => !open)}
            >
              Categories <ChevronDownIcon size={16} />
            </button>
            {categoriesOpen && <CategoriesMenu categories={categories} onNavigate={closeMenus} />}
          </div>
          {navLinks.slice(2).map((link) => (
            <NavLink key={link.href} {...link} active={isActive(link.href)} />
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            className={iconButton}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={theme === "dark"}
            onClick={toggleTheme}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link href="/shop" className={`${iconButton} hidden sm:flex`} aria-label="Search products">
            <SearchIcon />
          </Link>
          <Link href="/account/wishlist" className={`${iconButton} hidden sm:flex`} aria-label="Wishlist">
            <HeartIcon />
          </Link>
          <Link href="/cart" className={`${iconButton} relative`} aria-label={`Cart, ${totalQuantity} items`}>
            <CartIcon />
            {totalQuantity > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-white">
                {totalQuantity}
              </span>
            )}
          </Link>
          <Link href="/sign-in" className={`${iconButton} hidden sm:flex`} aria-label="Sign in">
            <UserIcon />
          </Link>
          <div className="ml-2 hidden md:block">
            <Button href="/shop">Shop Now</Button>
          </div>
          <button
            className={`${iconButton} lg:hidden`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && <MobileMenu categories={categories} isActive={isActive} onNavigate={closeMenus} />}
    </header>
  );
}

function NavLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`py-2 text-sm font-medium hover:text-primary ${
        active ? "font-semibold text-primary" : "text-ink"
      }`}
    >
      {label}
    </Link>
  );
}

function CategoriesMenu({ categories, onNavigate }: { categories: Category[]; onNavigate: () => void }) {
  return (
    <div className="absolute left-1/2 top-full w-[760px] -translate-x-1/2 pt-3" onClick={onNavigate}>
      <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
        <div className="grid grid-cols-4 gap-6">
          {categories.map((category) => (
            <div key={category.slug}>
              <Link
                href={`/shop?category=${category.slug}`}
                className="text-base font-bold text-primary hover:underline"
              >
                {category.name}
              </Link>
              <ul className="mt-3 space-y-2">
                {category.subcategories.map((sub) => (
                  <li key={sub}>
                    <Link
                      href={`/shop?category=${category.slug}`}
                      className="text-sm text-muted hover:text-ink"
                    >
                      {sub}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Link
          href="/shop/macbook-air-13-m3"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-primary"
        >
          New: MacBook Air M3 · Explore now <ArrowRightIcon size={16} />
        </Link>
      </div>
    </div>
  );
}

function MobileMenu({ categories, isActive, onNavigate }: { categories: Category[]; isActive: (href: string) => boolean; onNavigate: () => void }) {
  return (
    <div className="border-t border-line bg-white lg:hidden" onClick={onNavigate}>
      <nav className="page-container flex flex-col py-3" aria-label="Mobile">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-3 py-3 text-base font-medium ${
              isActive(link.href) ? "bg-accent text-primary" : "text-ink"
            }`}
          >
            {link.label}
          </Link>
        ))}

        <p className="mt-3 px-3 text-xs font-bold uppercase tracking-wide text-muted">Categories</p>
        <div className="grid grid-cols-2 gap-1 py-2">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="rounded-lg px-3 py-3 text-base font-medium text-ink"
            >
              {category.name}
            </Link>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2 border-t border-line pt-4 sm:hidden">
          <Button href="/sign-in" variant="secondary">
            <UserIcon size={18} /> My account
          </Button>
          <Button href="/account/wishlist" variant="secondary">
            <HeartIcon size={18} /> Wishlist
          </Button>
          <Button href="/shop" className="col-span-2">
            Shop Now
          </Button>
        </div>
      </nav>
    </div>
  );
}


