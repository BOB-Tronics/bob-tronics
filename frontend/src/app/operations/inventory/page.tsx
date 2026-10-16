"use client";
import Link from "next/link";

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

const unitsByProduct: Record<string, number> = {
  p1: 18,
  p2: 24,
  p3: 12,
  p4: 28,
  p5: 7,
  p6: 3,
};

const skuOverrides: Record<string, string> = {
  p2: "BT-APL-IP15-256",
  p4: "BT-SNY-XM5-BLK",
  p5: "BT-DEL-XPS-512",
  p6: "BT-SAM-S24-256",
};

const startingInventory = ["p1", "p2", "p3", "p6", "p4", "p5"].flatMap((id) => {
  const product = products.find((item) => item.id === id);
  return product ? [{ ...product, units: unitsByProduct[id] ?? product.stockCount }] : [];
});

type InventoryProduct = (typeof startingInventory)[number];
type StockMovement = {
  date: string;
  product: string;
  movement: string;
  reason: string;
  updatedBy: string;
};

const initialMovements: StockMovement[] = [
  { date: "01 Oct · 13:50", product: "MacBook Air M3", movement: "+10", reason: "Supplier delivery", updatedBy: "Emmanuel K." },
  { date: "01 Oct · 14:32", product: "MacBook Air M3", movement: "−1", reason: "Order BT-10482", updatedBy: "System" },
  { date: "30 Sep · 16:00", product: "Galaxy S24 Ultra", movement: "−2", reason: "Customer orders", updatedBy: "System" },
];

const filters = ["All inventory", "Low stock (8)", "Out of stock (3)", "Stock history"];

function stockStatus(units: number) {
  if (units === 0) return "Out of stock";
  if (units <= 5) return "Low stock";
  return "In stock";
}

export default function OperationsInventoryPage() {
  const [inventory, setInventory] = useState(startingInventory);
  const [movements, setMovements] = useState(initialMovements);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const [adjustedUnits, setAdjustedUnits] = useState(0);

  const visibleInventory = useMemo(() => {
    const query = search.trim().toLowerCase();
    return inventory.filter((item) => {
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        (skuOverrides[item.id] ?? item.sku).toLowerCase().includes(query);
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      const status = stockStatus(item.units);
      const matchesStatus =
        activeFilter.startsWith("Low stock")
          ? status === "Low stock"
          : activeFilter.startsWith("Out of stock")
            ? status === "Out of stock"
            : true;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [inventory, search, categoryFilter, activeFilter]);

  function startAdjustment(item: InventoryProduct) {
    setAdjustingId(item.id);
    setAdjustedUnits(item.units);
  }

  function saveAdjustment() {
    const item = inventory.find((product) => product.id === adjustingId);
    if (!item || adjustedUnits < 0) return;
    const difference = adjustedUnits - item.units;
    if (difference !== 0) {
      setMovements((current) => [
        {
          date: "Today · Just now",
          product: item.name,
          movement: difference > 0 ? `+${difference}` : `−${Math.abs(difference)}`,
          reason: "Manual stock adjustment",
          updatedBy: "Emmanuel K.",
        },
        ...current,
      ]);
      setInventory((current) =>
        current.map((product) =>
          product.id === item.id ? { ...product, units: adjustedUnits } : product,
        ),
      );
    }
    setAdjustingId(null);
  }

  const totalUnits = 1284 + inventory.reduce((total, item) => total + item.units - (unitsByProduct[item.id] ?? item.stockCount), 0);

  return (
    <div className="operations-dashboard min-h-screen bg-[#e9edff] text-slate-900 lg:flex">
      <style>{`body:has(.operations-dashboard) > header, body:has(.operations-dashboard) > footer { display: none; }`}</style>
      <aside className="flex shrink-0 flex-col bg-[#080e29] px-5 py-5 text-white lg:sticky lg:top-0 lg:h-screen lg:w-[220px]">
        <Link href="/operations/dashboard" className="mb-7 text-xl font-extrabold tracking-tight">BOB TRONICS</Link>
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Operations workspace</p>
        <nav aria-label="Operations" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto pb-2 lg:mx-0 lg:flex-col lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain">
          {navigation.map(([icon, label, href]) => {
            const active = label === "Inventory";
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
          <p className="text-sm font-semibold text-slate-800">Workspace / Dashboard</p>
          <div className="flex items-center gap-4 text-indigo-800"><button aria-label="Notifications" className="text-lg">♧</button><span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-50 text-xs font-bold">EK</span></div>
        </header>

        <main className="min-h-[calc(100vh-70px)] bg-[linear-gradient(135deg,#e0e5fa_0%,#edf0ff_45%,#dfe5fa_100%)] px-4 py-7 sm:px-7 lg:px-8">
          <div className="mx-auto max-w-[1500px]">
            <p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Inventory</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Inventory</h1>
            <p className="mt-2 text-sm text-slate-500">Monitor availability, stock levels and replenishment.</p>

            <div className="mt-6 flex flex-wrap items-end gap-3">
              <label className="min-w-[240px] flex-1 text-xs font-semibold text-slate-800">
                Search inventory
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Enter product or SKU" className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none placeholder:text-slate-400 focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100" />
              </label>
              <label className="sr-only" htmlFor="inventory-category">Category filter</label>
              <select id="inventory-category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900">
                <option value="all">Filters · All categories</option>
                {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
              </select>
              <button type="button" className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900 hover:bg-indigo-50">Export</button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <article className="rounded-2xl border border-white/70 bg-white p-5 shadow-[0_8px_28px_rgba(29,45,99,.07)]"><p className="text-[28px] font-extrabold">{totalUnits.toLocaleString()}</p><p className="mt-3 text-xs text-slate-500">Units in stock</p></article>
              <article className="rounded-2xl border border-white/70 bg-white p-5 shadow-[0_8px_28px_rgba(29,45,99,.07)]"><p className="text-[28px] font-extrabold text-amber-700">8</p><p className="mt-3 text-xs text-slate-500">Low stock products</p></article>
              <article className="rounded-2xl border border-white/70 bg-white p-5 shadow-[0_8px_28px_rgba(29,45,99,.07)]"><p className="text-[28px] font-extrabold">3</p><p className="mt-3 text-xs text-slate-500">Out of stock</p></article>
            </div>

            <div className="mt-5 rounded-lg border border-white/70 bg-[#f0efff] px-4 py-4">
              <p className="text-sm font-bold text-indigo-900">Low stock: Galaxy S24 Ultra · 3 units</p>
              <p className="mt-1 text-xs text-slate-500">Reorder threshold is 5 units. Last restocked 20 September 2026.</p>
            </div>

            <div role="tablist" aria-label="Inventory view" className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
              {filters.map((filter) => {
                const selected = activeFilter === filter;
                return <button key={filter} role="tab" aria-selected={selected} onClick={() => setActiveFilter(filter)} className={`shrink-0 rounded-lg border px-3.5 py-2.5 text-xs font-semibold ${selected ? "border-[#10139a] bg-[#efefff] text-indigo-900" : "border-transparent bg-white text-slate-500 hover:bg-indigo-50"}`}>{filter}</button>;
              })}
            </div>

            {adjustingId && (
              <section className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-indigo-100 bg-white p-4">
                <label className="min-w-48 flex-1 text-xs font-semibold">Adjust stock for {inventory.find((item) => item.id === adjustingId)?.name}
                  <input type="number" min="0" value={adjustedUnits} onChange={(event) => setAdjustedUnits(Number(event.target.value))} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal" />
                </label>
                <button type="button" onClick={saveAdjustment} className="h-10 rounded-lg bg-[#10139a] px-4 text-xs font-semibold text-white">Save adjustment</button>
                <button type="button" onClick={() => setAdjustingId(null)} className="h-10 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-600">Cancel</button>
              </section>
            )}

            <section className="mt-5 rounded-2xl border border-white/70 bg-white p-5 shadow-[0_8px_28px_rgba(29,45,99,.07)] sm:p-6">
              <h2 className="mb-5 text-lg font-bold tracking-tight text-slate-800">{activeFilter === "Stock history" ? "Stock history" : "Stock overview"}</h2>
              {activeFilter === "Stock history" ? (
                <MovementTable movements={movements} />
              ) : (
                <>
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full min-w-[780px] text-left text-xs">
                      <thead className="bg-slate-50 text-[10px] text-slate-500"><tr>{["Product", "SKU", "Category", "Price", "Stock", "Status", "Actions"].map((heading) => <th key={heading} className="px-3 py-3.5 font-semibold">{heading}</th>)}</tr></thead>
                      <tbody>
                        {visibleInventory.map((item) => {
                          const category = categories.find((entry) => entry.slug === item.category);
                          const status = stockStatus(item.units);
                          return (
                            <tr key={item.id} className="border-t border-slate-200">
                              <th scope="row" className="whitespace-nowrap px-3 py-4 font-semibold text-slate-900">{item.name}</th>
                              <td className="whitespace-nowrap px-3 py-4">{skuOverrides[item.id] ?? item.sku}</td>
                              <td className="px-3 py-4">{category?.name}</td>
                              <td className="whitespace-nowrap px-3 py-4">{formatPrice(item.price)}</td>
                              <td className="px-3 py-4">{item.units}</td>
                              <td className="px-3 py-4">{status}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-indigo-800"><button type="button" onClick={() => startAdjustment(item)}>Edit · Adjust</button></td>
                            </tr>
                          );
                        })}
                        {visibleInventory.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">No inventory items match your filters.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-5 text-[11px] text-slate-500">Showing {visibleInventory.length} of 190 products · Last synced 1 minute ago</p>
                </>
              )}
            </section>

            {activeFilter !== "Stock history" && <section className="mt-5 rounded-2xl border border-white/70 bg-white p-5 shadow-[0_8px_28px_rgba(29,45,99,.07)] sm:p-6">
              <h2 className="mb-5 text-lg font-bold tracking-tight text-slate-800">Recent stock movements</h2>
              <MovementTable movements={movements.slice(0, 3)} />
            </section>}
          </div>
        </main>
      </div>
    </div>
  );
}

function MovementTable({ movements }: { movements: StockMovement[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[700px] text-left text-xs">
        <thead className="bg-slate-50 text-[10px] text-slate-500"><tr>{["Date", "Product", "Movement", "Reason", "Updated by"].map((heading) => <th key={heading} className="px-3 py-3.5 font-semibold">{heading}</th>)}</tr></thead>
        <tbody>{movements.map((movement, index) => <tr key={`${movement.date}-${index}`} className="border-t border-slate-200"><th scope="row" className="whitespace-nowrap px-3 py-4 font-semibold">{movement.date}</th><td className="px-3 py-4">{movement.product}</td><td className="px-3 py-4">{movement.movement}</td><td className="px-3 py-4">{movement.reason}</td><td className="whitespace-nowrap px-3 py-4 text-indigo-800">{movement.updatedBy}</td></tr>)}</tbody>
      </table>
    </div>
  );
}










