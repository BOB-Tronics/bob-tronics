import Image from "next/image";
import Link from "next/link";
import { CgShoppingCart } from "react-icons/cg";
import { CiHeart } from "react-icons/ci";
import { FiSearch, FiUser } from "react-icons/fi";
import logo from "../../asset/logo.png";
import "./navbar.css";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/checkout" },
  { label: "Categories", href: "/orders" },
  { label: "IT Services", href: "/orders" },
  { label: "About", href: "/orders" },
  { label: "Contact", href: "/checkout" },
];

export default function Navbar() {
  return (
    <header className="site-navbar">
      <Link className="site-navbar-brand" href="/" aria-label="Bob Tronics home">
        <Image src={logo} alt="Bob Tronics logo" className="site-navbar-logo" priority />
        <span className="site-navbar-brand-copy">
          <strong>BOB TRONICS</strong>
          <span>A Technology Hub</span>
        </span>
      </Link>

      <nav className="site-navbar-links" aria-label="Main navigation">
        {navigation.map((item) => (
          <Link key={item.label} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="site-navbar-actions" aria-label="Quick actions">
        <Link className="site-navbar-icon" href="/checkout" aria-label="Search">
          <FiSearch />
        </Link>
        <Link className="site-navbar-icon" href="/orders" aria-label="Wishlist">
          <CiHeart />
        </Link>
        <Link className="site-navbar-icon" href="/checkout" aria-label="Shopping cart">
          <CgShoppingCart />
        </Link>
        <Link className="site-navbar-icon" href="/orders" aria-label="User account">
          <FiUser />
        </Link>
        <Link className="site-navbar-shop" href="/checkout">
          Shop Now
        </Link>
      </div>
    </header>
  );
}