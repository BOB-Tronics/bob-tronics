"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import OperationsShell from "@/components/operations/OperationsShell";
import { products } from "@/lib/mock-data";

export default function DeleteProductPage() {
  const [deleted, setDeleted] = useState(false);
  const product = products[0];

  return <OperationsShell active="Products">
    <p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Detail</p>
    <h1 className="mt-2 text-3xl font-extrabold">Delete product</h1>
    <p className="mt-2 text-sm text-slate-500">Catalogue / {product.name}</p>
    <section className="mt-6 rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="mb-5 text-lg font-bold">Product overview</h2><Image src={product.images[0]} alt={product.name} width={250} height={190} className="h-[190px] w-[250px] max-w-full rounded-lg object-cover" /><h3 className="mt-4 text-2xl font-bold">{product.name}</h3><p className="mt-4 text-sm">{product.sku} · Published · {product.stockCount} units · RWF {product.price.toLocaleString()}</p><button type="button" onClick={() => setDeleted(true)} className="mt-5 rounded-lg bg-rose-700 px-4 py-3 text-xs font-semibold text-white">Delete product</button></section>
    <section className="mt-6 max-w-[560px] rounded-2xl bg-white p-6 shadow-card sm:p-8">{deleted ? <><span aria-hidden="true" className="text-2xl text-emerald-700">✓</span><h2 className="mt-4 text-2xl font-bold">Product deleted</h2><p className="mt-3 text-sm text-slate-600">The product was removed in this demo session.</p><Link href="/operations/products" className="mt-5 inline-flex rounded-lg bg-[#10139a] px-4 py-3 text-xs font-semibold text-white">Back to products</Link></> : <><span aria-hidden="true" className="text-3xl text-rose-600">⚠</span><h2 className="mt-4 text-2xl font-bold">Delete this product?</h2><p className="mt-4 text-sm leading-relaxed">{product.name} will be removed from your catalogue. Existing orders and invoices will keep their product records.</p><div className="mt-5 rounded-lg bg-rose-50 p-4"><p className="text-xs font-semibold text-rose-700">This action cannot be undone</p><p className="mt-1 text-xs text-slate-500">Consider archiving the product if you may need it again.</p></div><div className="mt-5 flex flex-wrap gap-3"><Link href="/operations/products" className="rounded-lg border border-slate-200 px-4 py-3 text-xs font-semibold text-indigo-900">Keep product</Link><button type="button" onClick={() => setDeleted(true)} className="rounded-lg bg-rose-700 px-4 py-3 text-xs font-semibold text-white">Delete product</button></div></>}</section>
  </OperationsShell>;
}
