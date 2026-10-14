"use client";
import Link from "next/link";

import { useMemo, useState, type FormEvent } from "react";
import { categories } from "@/lib/mock-data";
import type { Category } from "@/types";

type ManagedCategory = Omit<Category, "slug"> & {
  slug: string;
  id: string;
  description: string;
  order: number;
  visible: boolean;
};

const initialCategories: ManagedCategory[] = categories.map((category, index) => ({
  ...category,
  id: category.slug,
  description:
    category.slug === "laptops"
      ? "Premium laptops for work, study and creativity."
      : category.tagline,
  order: index + 1,
  visible: true,
}));

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

function emptyCategory(): ManagedCategory {
  return {
    id: "",
    slug: "",
    name: "",
    tagline: "",
    description: "",
    image: "",
    count: 0,
    subcategories: [],
    order: initialCategories.length + 1,
    visible: true,
  };
}

export default function OperationsCategoriesPage() {
  const [categoryList, setCategoryList] = useState(initialCategories);
  const [form, setForm] = useState<ManagedCategory>(initialCategories[1]);
  const [isNew, setIsNew] = useState(false);
  const [search, setSearch] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [saved, setSaved] = useState(false);

  const visibleCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    return categoryList
      .filter((category) => {
        const matchesSearch =
          !query ||
          category.name.toLowerCase().includes(query) ||
          category.slug.toLowerCase().includes(query);
        const matchesVisibility =
          visibilityFilter === "all" ||
          (visibilityFilter === "visible" ? category.visible : !category.visible);
        return matchesSearch && matchesVisibility;
      })
      .sort((a, b) => a.order - b.order);
  }, [categoryList, search, visibilityFilter]);

  function startNewCategory() {
    setForm(emptyCategory());
    setIsNew(true);
    setSaved(false);
  }

  function editCategory(category: ManagedCategory) {
    setForm({ ...category });
    setIsNew(false);
    setSaved(false);
  }

  function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const slug = form.slug.trim().toLowerCase().replace(/\s+/g, "-");
    const nextCategory = {
      ...form,
      id: isNew ? slug : form.id,
      slug,
      name: form.name.trim(),
      count: isNew ? 0 : form.count,
    };

    setCategoryList((current) =>
      isNew
        ? [...current, nextCategory]
        : current.map((category) => (category.id === form.id ? nextCategory : category)),
    );
    setForm(nextCategory);
    setIsNew(false);
    setSaved(true);
  }

  function toggleVisibility(category: ManagedCategory) {
    setCategoryList((current) =>
      current.map((item) =>
        item.id === category.id ? { ...item, visible: !item.visible } : item,
      ),
    );
    if (form.id === category.id) {
      setForm((current) => ({ ...current, visible: !current.visible }));
    }
  }

  const activeCount = categoryList.filter((category) => category.visible).length;
  const assignedProducts = categoryList.reduce((total, category) => total + category.count, 0);

  return (
    <div className="operations-dashboard min-h-screen bg-[#e9edff] text-slate-900 lg:flex">
      <style>{`body:has(.operations-dashboard) > header, body:has(.operations-dashboard) > footer { display: none; }`}</style>
      <aside className="flex shrink-0 flex-col bg-[#080e29] px-5 py-5 text-white lg:sticky lg:top-0 lg:h-screen lg:w-[220px]">
        <Link href="/operations/dashboard" className="mb-7 text-xl font-extrabold tracking-tight">BOB TRONICS</Link>
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Operations workspace</p>
        <nav aria-label="Operations" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto pb-2 lg:mx-0 lg:flex-col lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain">
          {navigation.map(([icon, label, href]) => {
            const active = label === "Categories";
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
          <p className="text-sm font-semibold text-slate-800">Workspace / Categories</p>
          <div className="flex items-center gap-4 text-indigo-800"><button aria-label="Notifications" className="text-lg">♧</button><span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-50 text-xs font-bold">EK</span></div>
        </header>

        <main className="min-h-[calc(100vh-70px)] bg-[linear-gradient(135deg,#e0e5fa_0%,#edf0ff_45%,#dfe5fa_100%)] px-4 py-7 sm:px-7 lg:px-8">
          <div className="mx-auto max-w-[1500px]">
            <p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Categories</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Categories</h1>
            <p className="mt-2 text-sm text-slate-500">Keep your catalogue clear and easy to explore.</p>

            <div className="mt-6 flex flex-wrap items-end gap-3">
              <label className="min-w-[240px] flex-1 text-xs font-semibold text-slate-800">
                Search categories
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Enter keyword" className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none placeholder:text-slate-400 focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100" />
              </label>
              <label className="sr-only" htmlFor="visibility-filter">Visibility filter</label>
              <select id="visibility-filter" value={visibilityFilter} onChange={(event) => setVisibilityFilter(event.target.value)} className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900">
                <option value="all">Filters · All categories</option>
                <option value="visible">Visible</option>
                <option value="hidden">Archived</option>
              </select>
              <button type="button" className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900 hover:bg-indigo-50">Export</button>
              <button type="button" onClick={startNewCategory} className="h-11 rounded-lg bg-[#10139a] px-4 text-xs font-semibold text-white hover:bg-[#080c75]">＋ Add category</button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <article className="rounded-2xl border border-white/70 bg-white p-5 shadow-[0_8px_28px_rgba(29,45,99,.07)]"><p className="text-[28px] font-extrabold">{activeCount}</p><p className="mt-3 text-xs text-slate-500">Active categories</p></article>
              <article className="rounded-2xl border border-white/70 bg-white p-5 shadow-[0_8px_28px_rgba(29,45,99,.07)]"><p className="text-[28px] font-extrabold">{assignedProducts}</p><p className="mt-3 text-xs text-slate-500">Assigned products</p></article>
              <article className="rounded-2xl border border-white/70 bg-white p-5 shadow-[0_8px_28px_rgba(29,45,99,.07)]"><p className="text-[28px] font-extrabold">0</p><p className="mt-3 text-xs text-slate-500">Uncategorised</p></article>
            </div>

            <section className="mt-5 rounded-2xl border border-white/70 bg-white p-5 shadow-[0_8px_28px_rgba(29,45,99,.07)] sm:p-6">
              <h2 className="mb-5 text-lg font-bold tracking-tight text-slate-800">Category management</h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[700px] text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] text-slate-500">
                    <tr>{["Category", "Slug", "Products", "Visibility", "Sort order", "Actions"].map((heading) => <th key={heading} className="px-3 py-3.5 font-semibold">{heading}</th>)}</tr>
                  </thead>
                  <tbody>
                    {visibleCategories.map((category) => (
                      <tr key={category.id} className={`border-t border-slate-200 ${form.id === category.id && !isNew ? "bg-indigo-50/40" : ""}`}>
                        <th scope="row" className="px-3 py-4 font-semibold text-slate-900">{category.name}</th>
                        <td className="px-3 py-4">{category.slug}</td>
                        <td className="px-3 py-4">{category.count}</td>
                        <td className="px-3 py-4">{category.visible ? "Visible" : "Archived"}</td>
                        <td className="px-3 py-4">{category.order}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-indigo-800">
                          <button type="button" onClick={() => editCategory(category)}>Edit</button>
                          <span className="px-1">·</span>
                          <button type="button" onClick={() => toggleVisibility(category)}>{category.visible ? "Archive" : "Restore"}</button>
                        </td>
                      </tr>
                    ))}
                    {visibleCategories.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">No categories match your search and filters.</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-5 rounded-2xl border border-white/70 bg-white p-5 shadow-[0_8px_28px_rgba(29,45,99,.07)] sm:p-6">
              <h2 className="mb-5 text-lg font-bold tracking-tight text-slate-800">{isNew ? "Add category" : `Edit category · ${form.name}`}</h2>
              <form onSubmit={saveCategory} className="space-y-4">
                <label className="block text-xs font-semibold text-slate-800">Category name *
                  <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100" />
                </label>
                <label className="block text-xs font-semibold text-slate-800">URL slug *
                  <input required value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100" />
                </label>
                <label className="block text-xs font-semibold text-slate-800">Description
                  <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-2 min-h-28 w-full resize-y rounded-lg border border-slate-200 px-3 py-3 text-sm font-normal outline-none focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100" />
                </label>
                <label className="block text-xs font-semibold text-slate-800">Category image
                  <span className="relative mt-2 flex h-11 w-full items-center rounded-lg border border-slate-200 px-3 text-sm font-normal text-slate-700">
                    ＋ {form.image || "Upload category image · JPG or PNG"}
                    <input type="file" accept="image/png,image/jpeg" aria-label="Upload category image" onChange={(event) => { const file = event.target.files?.[0]; if (file) setForm({ ...form, image: file.name }); }} className="absolute inset-0 cursor-pointer opacity-0" />
                  </span>
                </label>
                <label className="block text-xs font-semibold text-slate-800">Display order
                  <input type="number" min="1" value={form.order} onChange={(event) => setForm({ ...form, order: Number(event.target.value) })} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100" />
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-800">
                  <input type="checkbox" checked={form.visible} onChange={(event) => setForm({ ...form, visible: event.target.checked })} className="accent-indigo-800" />
                  Visible in store navigation
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <button type="submit" className="h-11 rounded-lg bg-[#10139a] px-5 text-xs font-semibold text-white hover:bg-[#080c75]">{isNew ? "Save category" : "Save category"}</button>
                  {saved && <p role="status" className="text-xs font-medium text-emerald-700">Category saved in this demo session.</p>}
                </div>
              </form>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}












