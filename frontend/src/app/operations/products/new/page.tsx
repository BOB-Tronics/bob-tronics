"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import OperationsShell from "@/components/operations/OperationsShell";
import { categories, products } from "@/lib/mock-data";

type Specification = { id: number; attribute: string; value: string };
const initialSpecs: Specification[] = [
  { id: 1, attribute: "Processor", value: "Apple M3 · 8-core CPU" },
  { id: 2, attribute: "Memory", value: "8GB unified memory" },
  { id: 3, attribute: "Storage", value: "256GB SSD" },
  { id: 4, attribute: "Display", value: '13.6” Liquid Retina' },
  { id: 5, attribute: "Finish", value: "Midnight" },
  { id: 6, attribute: "Battery", value: "Up to 18 hours" },
];
const fieldClass = "mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100";
const areaClass = "mt-2 min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-3 text-xs font-normal outline-none focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100";

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("laptops");
  const [sku, setSku] = useState("");
  const [summary, setSummary] = useState("Powerfully light. Beautifully capable.");
  const [description, setDescription] = useState("Apple M3 chip. 13.6-inch Liquid Retina display. Up to 18 hours of battery life. All in an incredibly portable design.");
  const [status, setStatus] = useState("Draft");
  const [featured, setFeatured] = useState(true);
  const [visible, setVisible] = useState(true);
  const [available, setAvailable] = useState(true);
  const [slug, setSlug] = useState("macbook-air-13-m3");
  const [seoTitle, setSeoTitle] = useState('MacBook Air 13” M3 | BOB TRONICS');
  const [image, setImage] = useState(products[0].images[0]);
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("15,200");
  const [stock, setStock] = useState("0");
  const [threshold, setThreshold] = useState("5");
  const [trackInventory, setTrackInventory] = useState(true);
  const [allowBackorders, setAllowBackorders] = useState(false);
  const [specs, setSpecs] = useState(initialSpecs);
  const [included, setIncluded] = useState("MacBook Air · 30W USB-C Power Adapter · MagSafe 3 Cable · Documentation");
  const [warranty, setWarranty] = useState("1-year limited warranty");
  const [savedMessage, setSavedMessage] = useState("");

  function saveProduct(nextStatus: string) {
    setStatus(nextStatus);
    setSavedMessage(nextStatus === "Published" ? "Product published in this demo session." : "Draft saved in this demo session.");
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveProduct(status);
  }

  function updateSpec(id: number, key: "attribute" | "value", value: string) {
    setSpecs((current) => current.map((spec) => spec.id === id ? { ...spec, [key]: value } : spec));
  }

  function uploadImage(file?: File) {
    if (file) setImage(URL.createObjectURL(file));
  }

  return <OperationsShell active="Products">
    <p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Detail</p>
    <h1 className="mt-2 text-3xl font-extrabold">Add product</h1>
    <p className="mt-1 text-xs text-slate-500">Catalogue / MacBook Air 13” M3</p>
    <form onSubmit={submitForm} className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(250px,.8fr)]">
      <div className="space-y-5">
        <section className="rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="mb-5 text-base font-bold">Product information</h2><div className="space-y-4">
          <label className="block text-[11px] font-semibold">Product name *<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter product name" className={fieldClass} /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-[11px] font-semibold">Brand *<select required value={brand} onChange={(event) => setBrand(event.target.value)} className={fieldClass}><option value="">Select brand</option>{["Apple", "Samsung", "Sony", "Dell", "PlayStation"].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="block text-[11px] font-semibold">Category *<select value={category} onChange={(event) => setCategory(event.target.value)} className={fieldClass}>{categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
          </div>
          <label className="block text-[11px] font-semibold">SKU *<input required value={sku} onChange={(event) => setSku(event.target.value)} placeholder="Enter unique SKU" className={fieldClass} /></label>
          <label className="block text-[11px] font-semibold">Short description<input value={summary} onChange={(event) => setSummary(event.target.value)} className={fieldClass} /></label>
          <label className="block text-[11px] font-semibold">Product description<textarea value={description} onChange={(event) => setDescription(event.target.value)} className={areaClass} /></label>
        </div></section>

        <section className="rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="mb-4 text-base font-bold">Product images</h2>
          <Image src={image} alt="Product preview" width={1200} height={700} unoptimized className="h-56 w-full rounded-lg bg-slate-100 object-contain sm:h-64" />
          <label className="mt-4 block text-[11px] font-semibold">Upload images
            <span className="relative mt-2 flex h-10 items-center rounded-lg border border-slate-200 px-3 text-xs font-normal">＋ Drag &amp; drop or browse files · JPG, PNG · Max 5MB<input type="file" accept="image/png,image/jpeg" onChange={(event) => uploadImage(event.target.files?.[0])} className="absolute inset-0 cursor-pointer opacity-0" /></span>
          </label>
          <div className="mt-3 flex gap-2"><button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-semibold text-indigo-900">Set main image</button><button type="button" onClick={() => setImage(products[0].images[0])} className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-semibold text-indigo-900">Remove</button></div>
          <p className="mt-3 text-[10px] text-slate-500">Recommended 1600 × 1600px · Add gallery images for front, side and detail views.</p>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="mb-4 text-base font-bold">Pricing &amp; Inventory</h2><div className="grid gap-3 sm:grid-cols-2">
          <label className="text-[11px] font-semibold">Selling price (RWF) *<input required type="number" min="0" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="Enter price" className={fieldClass} /></label>
          <label className="text-[11px] font-semibold">Compare-at price (RWF)<input value={comparePrice} onChange={(event) => setComparePrice(event.target.value)} className={fieldClass} /></label>
          <label className="text-[11px] font-semibold">Stock quantity *<input required type="number" min="0" value={stock} onChange={(event) => setStock(event.target.value)} className={fieldClass} /></label>
          <label className="text-[11px] font-semibold">Low-stock threshold<input type="number" min="0" value={threshold} onChange={(event) => setThreshold(event.target.value)} className={fieldClass} /></label>
        </div><div className="mt-4 flex flex-wrap gap-4"><Check label="Track inventory" value={trackInventory} change={setTrackInventory} /><Check label="Allow backorders" value={allowBackorders} change={setAllowBackorders} /></div></section>

        <section className="rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="mb-4 text-base font-bold">Specifications</h2>
          <div className="overflow-x-auto rounded-lg border border-slate-200"><table className="w-full min-w-[440px] text-left text-[11px]"><thead className="bg-slate-50 text-slate-500"><tr>{["Attribute", "Value", "Action"].map((heading) => <th key={heading} className="px-3 py-3">{heading}</th>)}</tr></thead><tbody>{specs.map((spec) => <tr key={spec.id} className="border-t border-slate-200"><td className="px-2 py-2"><input value={spec.attribute} onChange={(event) => updateSpec(spec.id, "attribute", event.target.value)} className="w-full rounded px-2 py-2" aria-label="Specification name" /></td><td className="px-2 py-2"><input value={spec.value} onChange={(event) => updateSpec(spec.id, "value", event.target.value)} className="w-full rounded px-2 py-2" aria-label="Specification value" /></td><td className="px-3 py-2 text-indigo-800"><button type="button" onClick={() => setSpecs((current) => current.filter((item) => item.id !== spec.id))}>Remove</button></td></tr>)}</tbody></table></div>
          <button type="button" onClick={() => setSpecs((current) => [...current, { id: Date.now(), attribute: "", value: "" }])} className="mt-3 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-semibold text-indigo-900">＋ Add specification</button>
          <label className="mt-5 block text-[11px] font-semibold">What’s included<textarea value={included} onChange={(event) => setIncluded(event.target.value)} className={areaClass} /></label>
          <label className="mt-4 block text-[11px] font-semibold">Warranty<input value={warranty} onChange={(event) => setWarranty(event.target.value)} className={fieldClass} /></label>
        </section>
      </div>

      <div className="space-y-5">
        <section className="rounded-2xl bg-white p-5 shadow-card"><h2 className="mb-4 text-base font-bold">Publishing</h2><label className="block text-[11px] font-semibold">Status<select value={status} onChange={(event) => setStatus(event.target.value)} className={fieldClass}><option>Draft</option><option>Published</option><option>Archived</option></select></label><div className="mt-4 space-y-3"><Check label="Featured product" value={featured} change={setFeatured} /><Check label="Visible in search" value={visible} change={setVisible} /><Check label="Available for purchase" value={available} change={setAvailable} /></div><Link href="/shop/macbook-air-13-m3" className="mt-4 inline-flex rounded-lg border border-slate-200 px-3 py-2.5 text-[11px] font-semibold text-indigo-900">Preview in store ↗</Link></section>
        <section className="rounded-2xl bg-white p-5 shadow-card"><h2 className="mb-4 text-base font-bold">Search listing</h2><label className="block text-[11px] font-semibold">URL slug<input value={slug} onChange={(event) => setSlug(event.target.value)} className={fieldClass} /></label><label className="mt-4 block text-[11px] font-semibold">SEO title<textarea value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} className={areaClass} /></label><p className="mt-3 text-[10px] text-slate-500">Updated 01 Oct 2026 by Emmanuel K.</p></section>
        <aside className="rounded-lg bg-[#efefff] p-4"><p className="text-xs font-bold text-indigo-900">Catalogue checklist</p><p className="mt-2 text-[10px] text-slate-500">Images ✓ · Pricing ✓ · Stock ✓ · Specifications ✓</p></aside>
      </div>
      <div className="flex flex-wrap items-center gap-2 xl:col-span-2"><button type="button" onClick={() => saveProduct("Published")} className="rounded-lg bg-[#10139a] px-4 py-3 text-[11px] font-semibold text-white">Publish product</button><button type="button" onClick={() => saveProduct("Draft")} className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-[11px] font-semibold text-indigo-900">Save as draft</button><Link href="/operations/products" className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-[11px] font-semibold text-indigo-900">Cancel</Link>{savedMessage && <span role="status" className="text-xs font-semibold text-emerald-700">{savedMessage} · {status}</span>}</div>
    </form>
  </OperationsShell>;
}

function Check({ label, value, change }: { label: string; value: boolean; change: (value: boolean) => void }) {
  return <label className="flex items-center gap-2 text-[11px] font-medium"><input type="checkbox" checked={value} onChange={(event) => change(event.target.checked)} className="accent-indigo-800" />{label}</label>;
}



