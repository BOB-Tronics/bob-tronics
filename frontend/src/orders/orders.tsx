import Link from "next/link";
import { FiCheck, FiHelpCircle } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import PrintInvoiceButton from "./PrintInvoiceButton";
import "./orders.css";

const accountLinks = [
  { label: "Overview", href: "/orders" },
  { label: "Orders", href: "/orders" },
  { label: "Track Order", href: "/orders" },
  { label: "Wishlist", href: "/orders" },
  { label: "Addresses", href: "/checkout" },
  { label: "Payments", href: "/checkout" },
  { label: "Profile", href: "/orders" },
  { label: "Notifications", href: "/orders" },
  { label: "Support", href: "/checkout" },
  { label: "Logout", href: "/" },
];

const trackingSteps = [
  { title: "Confirmed", time: "01 Oct · 14:32", detail: "Payment received", state: "complete" },
  { title: "Processing", time: "01 Oct · 15:10", detail: "Order verified by our team", state: "complete" },
  { title: "Packed · Current status", time: "02 Oct · 09:15", detail: "Your device is safely packed", state: "current" },
  { title: "Out for Delivery", time: "Expected 03 Oct · 09:00", detail: "Courier assignment pending", state: "upcoming" },
  { title: "Delivered", time: "Expected 03 Oct", detail: "Not yet delivered", state: "upcoming" },
];

export default function OrdersPage() {
  return (
    <div className="orders-page">
      <Navbar />

      <main className="orders-shell">
        <div className="breadcrumb"><Link href="/">Home</Link> / My account</div>
        <div className="order-heading">
          <div>
            <h1 className="page-title">Order BT-10482</h1>
            <p className="page-subtitle">Your technology, orders and support in one place.</p>
          </div>
        </div>

        <div className="orders-layout">
          <aside className="account-sidebar">
            <div className="account-profile">
              <div className="profile-avatar" aria-hidden="true">A</div>
              <h2>Ama Mensah</h2>
              <span>ama.mensah@example.com</span>
            </div>
            <nav className="account-nav" aria-label="Account menu">
              {accountLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={link.label === "Orders" ? "is-active" : ""}
                  aria-current={link.label === "Orders" ? "page" : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>

          <section className="order-content" id="order-details" aria-label="Order details">
            <div className="order-status-labels" aria-label="Order status">
              <span className="order-pill order-pill-packed">Packed</span>
              <span className="order-pill order-pill-paid">Payment received</span>
            </div>

            <section className="detail-card tracking-card">
              <h2>Order details</h2>
              <p className="tracking-intro">
                Placed 01 Oct 2026 · 14:32 <span>·</span> Delivery estimated 03 Oct 2026
              </p>
              <ol className="tracking-list">
                {trackingSteps.map((step) => (
                  <li className={`tracking-step is-${step.state}`} key={step.title}>
                    <span className="tracking-marker" aria-hidden="true">
                      {step.state === "complete" ? <FiCheck /> : null}
                    </span>
                    <div className="tracking-copy">
                      <h3>{step.title}</h3>
                      <p>{step.time}</p>
                      <p>{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <div className="order-info-grid">
              <section className="detail-card order-summary-card">
                <h2>Order summary</h2>
                <div className="ordered-product">
                  <div className="laptop-thumbnail" aria-label="MacBook Air product image">
                    <span className="laptop-screen"><i /></span>
                    <span className="laptop-base" />
                  </div>
                  <div className="ordered-product-copy">
                    <h3>MacBook Air 13&quot; M3</h3>
                    <p>Midnight · 8GB / 256GB · Qty 1</p>
                    <strong>RWF 14,500</strong>
                  </div>
                </div>
                <dl className="price-breakdown">
                  <div><dt>Subtotal</dt><dd>RWF 14,500</dd></div>
                  <div><dt>Delivery</dt><dd>RWF 80</dd></div>
                  <div className="discount-row"><dt>WELCOME500</dt><dd>− RWF 500</dd></div>
                  <div className="price-total"><dt>Total</dt><dd>RWF 14,080</dd></div>
                </dl>
                <p className="tax-note">Taxes included. Payments are encrypted and secure.</p>
              </section>

              <section className="detail-card delivery-payment-card">
                <h2>Delivery &amp; Payment</h2>
                <div className="delivery-details">
                  <strong>Ama Mensah</strong>
                  <p>Kigali · Nyarugenge</p>
                  <p>Standard Delivery · RWF 80</p>
                  <p>MTN MoMo · +250 24 ••• 0184 · Paid</p>
                  <span>Payment reference MM-882140</span>
                </div>
                <div className="order-actions">
                  <PrintInvoiceButton />
                  <Link href="/checkout"><FiHelpCircle /> Get help with this order</Link>
                </div>
              </section>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
