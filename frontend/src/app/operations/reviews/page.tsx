"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import OperationsShell from "@/components/operations/OperationsShell";
import { getReviews, type Review } from "@/services/reviews";

const tabs = ["All reviews", "Pending", "Published", "Hidden"];

export default function OperationsReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState(tabs[0]);
  const [search, setSearch] = useState("");

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setReviews(await getReviews());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return reviews.filter((review) => !query ||
      [review.author, review.product, review.text].some((text) => text.toLowerCase().includes(query)));
  }, [reviews, search]);

  return <OperationsShell active="Reviews">
    <p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Reviews</p>
    <h1 className="mt-2 text-3xl font-extrabold">Reviews</h1>
    <p className="mt-2 text-sm text-slate-500">Review feedback and publish with confidence.</p>
    <div className="mt-6 flex flex-wrap items-end gap-3">
      <label className="min-w-[240px] flex-1 text-xs font-semibold">Search reviews<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Enter keyword" className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal" /></label>
      <select aria-label="Review filter" className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900"><option>Filters · All ratings</option><option>5 stars</option><option>4 stars</option></select>
      <button className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900">Export</button>
    </div>
    <div role="tablist" aria-label="Review status" className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">{tabs.map((item, index) => <button key={item} role="tab" aria-selected={tab === item} disabled={index > 0} title={index > 0 ? "Not available yet" : undefined} onClick={() => setTab(item)} className={`shrink-0 rounded-lg border px-3.5 py-2.5 text-xs font-semibold ${tab === item ? "border-[#10139a] bg-[#efefff] text-indigo-900" : "border-transparent bg-white text-slate-500"}`}>{item}{index > 0 ? " · Not available yet" : ""}</button>)}</div>
    <section className="mt-5 rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="mb-5 text-lg font-bold">Moderation queue</h2>
      {loading ? <p role="status" className="rounded-lg bg-slate-50 p-6 text-sm text-slate-500">Loading reviews…</p>
        : error ? <div className="rounded-lg bg-slate-50 p-6 text-sm text-slate-500"><p>Unable to load reviews. Please try again.</p><button onClick={() => void loadReviews()} className="mt-3 rounded-lg bg-[#10139a] px-4 py-2.5 text-xs font-semibold text-white">Retry</button></div>
          : visible.length === 0 ? <p className="rounded-lg bg-slate-50 p-6 text-sm text-slate-500">{reviews.length === 0 ? "No reviews available." : "No reviews match your search."}</p>
            : <div className="space-y-4">{visible.map((review) => <article key={review.id} className="rounded-lg bg-slate-50 p-5">
              <p className="text-sm font-semibold">{review.author} · {review.product}</p>
              <p className="mt-2 text-xs text-amber-700">{review.rating === null ? "—" : `${"★".repeat(Math.max(0, Math.min(5, review.rating)))}${"☆".repeat(5 - Math.max(0, Math.min(5, review.rating)))}`} · {review.date}</p>
              <p className="mt-3 text-sm">{review.text}</p>
              <p className="mt-2 text-xs text-slate-500">Status: {review.status}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" disabled title="Not available yet" className="rounded-lg bg-[#10139a] px-4 py-2.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Publish · Not available yet</button>
                <button type="button" disabled title="Not available yet" className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-indigo-900 disabled:cursor-not-allowed disabled:opacity-50">Hide · Not available yet</button>
                <button type="button" disabled title="Not available yet" className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-indigo-900 disabled:cursor-not-allowed disabled:opacity-50">Reply · Not available yet</button>
              </div>
            </article>)}</div>}
    </section>
    <aside className="mt-5 rounded-lg bg-[#f0efff] px-4 py-4"><p className="text-sm font-bold text-indigo-900">Moderation guidance</p><p className="mt-2 text-xs text-slate-500">Publish authentic feedback, including constructive criticism. Hide only spam, abusive content or personal information.</p></aside>
  </OperationsShell>;
}
