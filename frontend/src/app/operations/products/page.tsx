"use client";
import Link from "next/link";

import Image from "next/image";
import { useMemo, useState } from "react";
import { categories, products } from "@/lib/mock-data";
import { formatPrice } from "@/lib/format";

const navigation = [
  ["▦", "Dashboard", "/operations/dashboard"],
  ["⬡", "Products", "/operations/products"],
  ["▦", "Categories", "/operations/categories"],
  ["♧", "Inventory", "/operations/inventory"],
  ["▣", "Orders", "/operations/orders"],
  ["♙", "Customers", "/operations/customers"],
  ["▤", "Payments", "/operations/payments"],
  ["▱", "Deliveries", "/operations/deliveries"],
  ["⚒", "IT Requests", "/operations/it-requests"],
  ["☆", "Reviews", "/operations/reviews"],
  ["♧", "Notifications", "/operations/notifications"],
  ["⌁", "Reports", "/operations/reports"],
  ["⚙", "Settings", "/operations/settings"],
];

const tabs = [
  { name: "All products", count: 190 },
  { name: "Published", count: 176 },
  { name: "Draft", count: 14 },
  { name: "Archived", count: 8 },
];

export default function OperationsProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("All products");

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (activeTab === "Draft" || activeTab === "Archived") return [];
    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query);
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [search, categoryFilter, activeTab]);

  return (
    <div className="operations-dashboard min-h-screen bg-[#e9edff] text-slate-900 lg:flex">
      <style>{`body:has(.operations-dashboard) > header, body:has(.operations-dashboard) > footer { display: none; }`}</style>
      <aside className="flex shrink-0 flex-col bg-[#080e29] px-5 py-5 text-white lg:sticky lg:top-0 lg:h-screen lg:w-[220px]">
        <Link href="/operations/dashboard" className="mb-7 text-xl font-extrabold tracking-tight">BOB TRONICS</Link>
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Operations workspace</p>
        <nav aria-label="Operations" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto pb-2 lg:mx-0 lg:flex-col lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain">
          {navigation.map(([icon, label, href]) => {
            const active = label === "Products";
            return (
              <Link key={label} href={href} aria-current={active ? "page" : undefined} className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${active ? "bg-[#1013a6] text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
                <span aria-hidden="true" className="w-4 text-center text-base">{icon}</span>{label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto hidden space-y-6 pt-8 lg:block">
          <div className="rounded-xl bg-[#efefff] p-4 text-[#10139a]">
            <p className="text-sm font-bold">All systems operational</p>
            <p className="mt-1 text-xs text-slate-500">Last sync · 1 minute ago</p>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">Demo workspace · Accra, GH</p>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex h-[70px] items-center justify-between border-b border-slate-100 bg-white px-5 sm:px-8">
          <p className="text-sm font-semibold text-slate-800">Workspace / Products</p>
          <div className="flex items-center gap-4 text-indigo-800"><button aria-label="Notifications" className="text-lg">♧</button><span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-50 text-xs font-bold">EK</span></div>
        </header>

        <main className="min-h-[calc(100vh-70px)] bg-[linear-gradient(135deg,#e0e5fa_0%,#edf0ff_45%,#dfe5fa_100%)] px-4 py-7 sm:px-7 lg:px-8">
          <div className="mx-auto max-w-[1500px]">
            <p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Products</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Products</h1>
            <p className="mt-2 text-sm text-slate-500">Manage your catalogue, pricing and product visibility.</p>

            <div className="mt-6 flex flex-wrap items-end gap-3">
              <label className="min-w-[240px] flex-1 text-xs font-semibold text-slate-800">
                Search products
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Enter keyword"
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none placeholder:text-slate-400 focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
              <label className="sr-only" htmlFor="product-category">Category filter</label>
              <select id="product-category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900">
                <option value="all">Filters · All categories</option>
                {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
              </select>
              <button type="button" className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900 hover:bg-indigo-50">Export</button>
              <Link href="/operations/products/new" className="inline-flex h-11 items-center rounded-lg bg-[#10139a] px-4 text-xs font-semibold text-white hover:bg-[#080c75]">＋ Add product</Link>
            </div>

            <div role="tablist" aria-label="Product status" className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
              {tabs.map((tab) => {
                const selected = activeTab === tab.name;
                return <button key={tab.name} role="tab" aria-selected={selected} onClick={() => setActiveTab(tab.name)} className={`shrink-0 rounded-lg border px-3.5 py-2.5 text-xs font-semibold ${selected ? "border-[#10139a] bg-[#efefff] text-indigo-900" : "border-transparent bg-white text-slate-500 hover:bg-indigo-50"}`}>{tab.name} ({tab.count})</button>;
              })}
            </div>

            <section className="mt-5 rounded-2xl border border-white/70 bg-white p-5 shadow-[0_8px_28px_rgba(29,45,99,.07)] sm:p-6">
              <h2 className="text-lg font-bold tracking-tight text-slate-800">Product catalogue</h2>
              <div className="my-5 flex flex-wrap items-center gap-4">
                <Image src={products[0].images[0]} alt="" width={100} height={76} className="h-[76px] w-[100px] rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900">{products[0].name}</p>
                  <p className="mt-1 text-xs text-slate-500">Featured · Updated 01 Oct 2026 · {products[0].brand}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">Published</span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[780px] text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] text-slate-500">
                    <tr>{["Product", "SKU", "Category", "Price", "Stock", "Visibility", "Actions"].map((heading) => <th key={heading} className="px-3 py-3.5 font-semibold">{heading}</th>)}</tr>
                  </thead>
                  <tbody>
                    {visibleProducts.map((product) => {
                      const category = categories.find((item) => item.slug === product.category);
                      return (
                        <tr key={product.id} className="border-t border-slate-200">
                          <th scope="row" className="whitespace-nowrap px-3 py-4 font-semibold text-slate-900">{product.name}</th>
                          <td className="whitespace-nowrap px-3 py-4">{product.sku}</td>
                          <td className="px-3 py-4">{category?.name}</td>
                          <td className="whitespace-nowrap px-3 py-4">{formatPrice(product.price)}</td>
                          <td className="px-3 py-4">{product.stockCount}</td>
                          <td className="px-3 py-4">Published</td>
                          <td className="whitespace-nowrap px-3 py-4 text-indigo-800"><button type="button">Edit</button><span className="px-1">·</span><Link href={`/operations/products/${product.slug}/delete`}>Delete</Link></td>
                        </tr>
                      );
                    })}
                    {visibleProducts.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">No products match the selected status, search and category filters.</td></tr>}
                  </tbody>
                </table>
              </div>
              <p className="mt-5 text-[11px] text-slate-500">{visibleProducts.length} of 190 products shown · Page 1 of 32</p>
            </section>

            <div className="mt-5 rounded-lg border border-white/70 bg-[#f0efff] px-4 py-4">
              <p className="text-sm font-bold text-indigo-900">Catalogue health</p>
              <p className="mt-1 text-xs text-slate-500">176 published products · 14 drafts · 8 products need updated images or specifications.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}













