"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import OperationsShell from "@/components/operations/OperationsShell";
import {
  adminCreateDiscount,
  adminDeleteDiscount,
  adminErrorMessage,
  adminFieldErrors,
  adminListDiscounts,
  adminListProducts,
  adminPatchDiscount,
} from "@/services/admin";
import type { BackendDiscount, BackendProduct, DiscountInput } from "@/types";

const field = "mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100";
// VERIFIED live: "percentage" is accepted; "fixed" has not been tested.
const discountTypes = [
  { value: "percentage", label: "Percentage (%)" },
  { value: "fixed", label: "Fixed amount (RWF)" },
];

interface DiscountForm {
  product: string;
  discount_type: string;
  discount_value: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

const emptyForm: DiscountForm = { product: "", discount_type: "percentage", discount_value: "", start_date: "", end_date: "", is_active: true };

// datetime-local inputs use "YYYY-MM-DDTHH:mm"; the backend accepts date-only strings.
function toInputValue(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toBackendDate(value: string): string {
  return value ? value.slice(0, 10) : "";
}

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function OperationsPromotionsPage() {
  const [discounts, setDiscounts] = useState<BackendDiscount[]>([]);
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<DiscountForm>(emptyForm);
  const [editing, setEditing] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [discountList, productList] = await Promise.all([adminListDiscounts(), adminListProducts()]);
      setDiscounts(discountList);
      setProducts(productList);
    } catch (e) {
      setError(adminErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const productName = useCallback(
    (id: number) => products.find((p) => p.product_id === id)?.name ?? `Product #${id}`,
    [products]
  );

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return discounts.filter((d) => !query || productName(d.product).toLowerCase().includes(query));
  }, [discounts, search, productName]);

  function start(item?: BackendDiscount) {
    setEditing(item?.discount_id ?? null);
    setForm(
      item
        ? {
            product: String(item.product),
            discount_type: item.discount_type,
            discount_value: item.discount_value,
            start_date: toInputValue(item.start_date),
            end_date: toInputValue(item.end_date),
            is_active: item.is_active,
          }
        : emptyForm
    );
    setMessage("");
    setFieldErrors({});
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setFieldErrors({});
    const body: DiscountInput = {
      product: Number(form.product),
      discount_type: form.discount_type,
      discount_value: form.discount_value,
      start_date: toBackendDate(form.start_date),
      end_date: toBackendDate(form.end_date),
      is_active: form.is_active,
    };
    try {
      if (editing !== null) await adminPatchDiscount(editing, body);
      else await adminCreateDiscount(body);
      await load();
      setMessage(editing !== null ? "Discount updated." : "Discount created.");
      if (editing === null) setForm(emptyForm);
    } catch (err) {
      setMessage(adminErrorMessage(err));
      setFieldErrors(adminFieldErrors(err));
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(item: BackendDiscount) {
    try {
      await adminPatchDiscount(item.discount_id, { is_active: !item.is_active });
      await load();
    } catch (e) {
      setError(adminErrorMessage(e));
    }
  }

  async function remove(item: BackendDiscount) {
    if (!window.confirm(`Delete the discount on “${productName(item.product)}”?`)) return;
    try {
      await adminDeleteDiscount(item.discount_id);
      await load();
    } catch (e) {
      setError(adminErrorMessage(e));
    }
  }

  return (
    <OperationsShell active="Promotions">
      <p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Promotions</p>
      <h1 className="mt-2 text-3xl font-extrabold">Promotions</h1>
      <p className="mt-2 text-sm text-slate-500">Create and manage product discounts shown in the store.</p>
      <div className="mt-6 flex flex-wrap items-end gap-3">
        <label className="min-w-[240px] flex-1 text-xs font-semibold">
          Search by product
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Enter product name" className={field} />
        </label>
        <button onClick={() => start()} className="h-11 rounded-lg bg-[#10139a] px-4 text-xs font-semibold text-white">＋ Add discount</button>
        <button onClick={() => void load()} className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900">Refresh</button>
      </div>

      <section className="mt-5 rounded-2xl bg-white p-5 shadow-card sm:p-6">
        <h2 className="mb-5 text-lg font-bold">Discounts ({discounts.length})</h2>
        {loading ? (
          <p role="status" className="py-8 text-center text-sm text-slate-500">Loading discounts…</p>
        ) : error ? (
          <div role="alert" className="py-8 text-center text-sm text-rose-700">{error}<button onClick={() => void load()} className="ml-3 underline">Retry</button></div>
        ) : visible.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">{discounts.length === 0 ? "No discounts yet." : "No discounts match your search."}</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full min-w-[820px] text-left text-xs">
              <thead className="bg-slate-50 text-[10px] text-slate-500">
                <tr>{["Product", "Type", "Value", "Starts", "Ends", "Status", "Actions"].map((x) => <th key={x} className="px-3 py-3.5 font-semibold">{x}</th>)}</tr>
              </thead>
              <tbody>
                {visible.map((d) => (
                  <tr key={d.discount_id} className="border-t border-slate-200">
                    <th className="px-3 py-4 font-semibold">{productName(d.product)}</th>
                    <td className="px-3 py-4">{discountTypes.find((t) => t.value === d.discount_type)?.label ?? d.discount_type}</td>
                    <td className="px-3 py-4">{d.discount_type === "percentage" ? `${Number(d.discount_value)}%` : `RWF ${Number(d.discount_value).toLocaleString()}`}</td>
                    <td className="px-3 py-4">{formatDateTime(d.start_date)}</td>
                    <td className="px-3 py-4">{formatDateTime(d.end_date)}</td>
                    <td className="px-3 py-4">{d.is_active ? "Active" : "Inactive"}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-indigo-800">
                      <button onClick={() => start(d)}>Edit</button>
                      <span className="px-2">·</span>
                      <button onClick={() => void toggleActive(d)}>{d.is_active ? "Deactivate" : "Activate"}</button>
                      <span className="px-2">·</span>
                      <button onClick={() => void remove(d)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-5 rounded-2xl bg-white p-5 shadow-card sm:p-6">
        <h2 className="mb-5 text-lg font-bold">{editing === null ? "Add discount" : `Edit discount #${editing}`}</h2>
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold sm:col-span-2">
            Product *
            <select required value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} className={field}>
              <option value="">Select a product</option>
              {products.map((p) => <option key={p.product_id} value={p.product_id}>{p.name} · RWF {Number(p.price).toLocaleString()}</option>)}
            </select>
            {fieldErrors.product && <span className="block text-rose-700">{fieldErrors.product}</span>}
          </label>
          <label className="text-xs font-semibold">
            Discount type *
            <select required value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })} className={field}>
              {discountTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            {fieldErrors.discount_type && <span className="block text-rose-700">{fieldErrors.discount_type}</span>}
          </label>
          <label className="text-xs font-semibold">
            Discount value *
            <input required inputMode="decimal" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} placeholder={form.discount_type === "percentage" ? "e.g. 10" : "e.g. 15000"} className={field} />
            {fieldErrors.discount_value && <span className="block text-rose-700">{fieldErrors.discount_value}</span>}
          </label>
          <label className="text-xs font-semibold">
            Starts *
            <input required type="datetime-local" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className={field} />
            {fieldErrors.start_date && <span className="block text-rose-700">{fieldErrors.start_date}</span>}
          </label>
          <label className="text-xs font-semibold">
            Ends *
            <input required type="datetime-local" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className={field} />
            {fieldErrors.end_date && <span className="block text-rose-700">{fieldErrors.end_date}</span>}
          </label>
          <label className="flex items-center gap-2 text-xs sm:col-span-2">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Active (shown to customers)
          </label>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <button disabled={busy} className="rounded-lg bg-[#10139a] px-5 py-3 text-xs font-semibold text-white disabled:opacity-60">{busy ? "Saving…" : editing === null ? "Create discount" : "Save changes"}</button>
            <button type="button" onClick={() => start()} className="rounded-lg border border-slate-200 px-4 py-3 text-xs">Clear</button>
            {message && <p role="status" className="text-xs text-slate-600">{message}</p>}
          </div>
        </form>
      </section>
    </OperationsShell>
  );
}
