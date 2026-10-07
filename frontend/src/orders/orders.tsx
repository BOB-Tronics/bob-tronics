"use client";

import { useMemo, useState } from "react";
import { CgShoppingCart } from "react-icons/cg";
import { CiHeart } from "react-icons/ci";
import { FiChevronRight, FiSearch, FiUser } from "react-icons/fi";
import logo from "../../asset/logo (1).png";
import "./orders.css";

type OrderStatus = "Packed" | "In progress" | "Delivered" | "Cancelled";

type OrderRow = {
  id: string;
  date: string;
  product: string;
  total: string;
  status: OrderStatus;
};

const orders: OrderRow[] = [
  {
    id: "BT-10482",
    date: "01 Oct 2026",
    product: "MacBook Air 13 M3",
    total: "GHC 14,080",
    status: "Packed",
  },
  {
    id: "BT-1021",
    date: "12 Sep 2026",
    product: "WH-1000XM5 x1",
    total: "GHC 3,880",
    status: "Delivered",
  },
  {
    id: "BT-10039",
    date: "28 Aug 2026",
    product: "iPhone 15 Pro x1",
    total: "GHC 12,880",
    status: "Delivered",
  },
  {
    id: "BT-10870",
    date: "14 Aug 2026",
    product: "Dell XPS 13",
    total: "GHC 9,500",
    status: "In progress",
  },
];

const tabs = [
  { label: "All orders", count: orders.length },
  { label: "In progress", count: orders.filter((item) => item.status === "In progress").length },
  { label: "Delivered", count: orders.filter((item) => item.status === "Delivered").length },
  { label: "Cancelled", count: orders.filter((item) => item.status === "Cancelled").length },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All orders");
  const [search, setSearch] = useState("");

  const filteredOrders = useMemo(() => {
    const currentTab = activeTab.toLowerCase();

    const filteredByTab =
      currentTab === "all orders"
        ? orders
        : orders.filter((item) => item.status.toLowerCase() === currentTab);

    if (!search.trim()) {
      return filteredByTab;
    }

    return filteredByTab.filter((item) => {
      const query = search.toLowerCase();
      return (
        item.id.toLowerCase().includes(query) ||
        item.product.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query)
      );
    });
  }, [activeTab, search]);

  return (
    <div className="orders-page">
      <div className="promo-strip">Genuine tech. Expert support. Delivered.</div>

      <header className="orders-header">
        <div className="brand-wrap">
          <img src={logo.src} alt="Bob Tronics logo" className="brand-logo" />
          <div className="brand-text-block">
            <span className="brand-name">BOB TRONICS</span>
            <span className="brand-tag">A Technology Hub</span>
          </div>
        </div>

        <nav className="nav-menu" aria-label="Main navigation">
          <a href="#">Home</a>
          <a href="#">Shop</a>
          <a href="#">Categories</a>
          <a href="#">IT Services</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>

        <div className="header-actions" aria-label="Quick actions">
          <button type="button" className="icon-button" aria-label="Search">
            <FiSearch />
          </button>
          <button type="button" className="icon-button" aria-label="User account">
            <FiUser />
          </button>
          <button type="button" className="icon-button" aria-label="Cart">
            <CgShoppingCart />
          </button>
          <button type="button" className="icon-button" aria-label="Wishlist">
            <CiHeart />
          </button>
          <button type="button" className="shop-button" aria-label="Shop now">
            Shop Now
          </button>
        </div>
      </header>

      <main className="orders-shell">
        <div className="breadcrumb">Home / My account</div>

        <h1 className="page-title">Orders</h1>
        <p className="page-subtitle">Your technology, orders and support in one place.</p>

        <div className="orders-layout">
          <aside className="sidebar">
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">A</div>
                <div className="profile-meta">
                  <h2>Ama Mensah</h2>
                  <span>ama.mensah@example.com</span>
                </div>
              </div>

              <nav className="sidebar-nav" aria-label="Account menu">
                <button type="button" className="nav-item">
                  Overview
                </button>
                <button type="button" className="nav-item active">
                  Orders
                </button>
                <button type="button" className="nav-item">
                  Track Order
                </button>
                <button type="button" className="nav-item">
                  Wishlist
                </button>
                <button type="button" className="nav-item">
                  Addresses
                </button>
                <button type="button" className="nav-item">
                  Payments
                </button>
                <button type="button" className="nav-item">
                  Profile
                </button>
                <button type="button" className="nav-item">
                  Notifications
                </button>
                <button type="button" className="nav-item">
                  Support
                </button>
                <button type="button" className="nav-item">
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          <section className="content-panel">
            <div className="tab-row" aria-label="Order status tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  className={`tab-button ${activeTab === tab.label ? "is-active" : ""}`}
                  onClick={() => setActiveTab(tab.label)}
                >
                  {tab.label}
                  <span className="tab-count">({tab.count})</span>
                </button>
              ))}
            </div>

            <div className="search-box">
              <label htmlFor="order-search">Search orders</label>
              <div className="search-input-wrap">
                <FiSearch className="search-icon" />
                <input
                  id="order-search"
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Enter order number or product"
                />
              </div>
            </div>

            <div className="table-card">
              <h2>Order history</h2>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Date</th>
                      <th>Product</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.date}</td>
                        <td>{item.product}</td>
                        <td>{item.total}</td>
                        <td>
                          <span className={`status-badge status-${item.status.toLowerCase().replace(/\s+/g, "-")}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <button type="button" className="view-order-button">
                            View order <FiChevronRight />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="footer-note">Showing all 3 orders • Download invoices from order details.</div>
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <span>BOB TRONICS • © 2026 • Demo store</span>
        <span>Support • Returns • warranty • Privacy • Terms • Secure payments</span>
      </footer>
    </div>
  );
}
