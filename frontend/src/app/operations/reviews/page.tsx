"use client";

import { useMemo, useState } from "react";
import OperationsShell from "@/components/operations/OperationsShell";

type Review = { id: string; author: string; product: string; date: string; rating: number; text: string; status: string };
const initialReviews: Review[] = [
  { id: "r1", author: "Kofi A.", product: 'MacBook Air 13” M3', date: "28 Sep 2026", rating: 5, text: "A brilliant everyday laptop. Fast, quiet and battery life is excellent.", status: "Pending" },
  { id: "r2", author: "Esi D.", product: 'MacBook Air 13” M3', date: "24 Sep 2026", rating: 5, text: "Great advice from the team and a smooth delivery experience.", status: "Pending" },
  { id: "r3", author: "Yaw S.", product: "PlayStation 5 Slim", date: "23 Sep 2026", rating: 4, text: "Great console. Delivery took an extra day but support kept me informed.", status: "Pending" },
];
const tabs = ["All reviews (128)", "Pending (8)", "Published (116)", "Hidden (4)"];

export default function OperationsReviewsPage() {
  const [reviews, setReviews] = useState(initialReviews);
  const [tab, setTab] = useState(tabs[1]);
  const [search, setSearch] = useState("");
  const [replyId, setReplyId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [replySent, setReplySent] = useState(false);
  const visible = useMemo(() => {
    const status = tab.startsWith("All") ? "All" : tab.split(" ")[0];
    const query = search.trim().toLowerCase();
    return reviews.filter((review) => (status === "All" || review.status === status) &&
      (!query || [review.author, review.product, review.text].some((text) => text.toLowerCase().includes(query))));
  }, [reviews, tab, search]);

  function setStatus(id: string, status: string) {
    setReviews((current) => current.map((review) => review.id === id ? { ...review, status } : review));
  }

  return <OperationsShell active="Reviews">
    <p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Reviews</p>
    <h1 className="mt-2 text-3xl font-extrabold">Reviews</h1>
    <p className="mt-2 text-sm text-slate-500">Review feedback and publish with confidence.</p>
    <div className="mt-6 flex flex-wrap items-end gap-3">
      <label className="min-w-[240px] flex-1 text-xs font-semibold">Search reviews<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Enter keyword" className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal" /></label>
      <select aria-label="Review filter" className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900"><option>Filters · All ratings</option><option>5 stars</option><option>4 stars</option></select>
      <button className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900">Export</button>
    </div>
    <div role="tablist" aria-label="Review status" className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">{tabs.map((item) => <button key={item} role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className={`shrink-0 rounded-lg border px-3.5 py-2.5 text-xs font-semibold ${tab === item ? "border-[#10139a] bg-[#efefff] text-indigo-900" : "border-transparent bg-white text-slate-500"}`}>{item}</button>)}</div>
    <section className="mt-5 rounded-2xl bg-white p-5 shadow-card sm:p-6"><h2 className="mb-5 text-lg font-bold">Moderation queue</h2><div className="space-y-4">
      {visible.map((review) => <article key={review.id} className="rounded-lg bg-slate-50 p-5">
        <p className="text-sm font-semibold">{review.author} · Verified purchase · {review.product}</p>
        <p className="mt-2 text-xs text-amber-700">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)} · {review.date}</p>
        <p className="mt-3 text-sm">{review.text}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => setStatus(review.id, "Published")} className="rounded-lg bg-[#10139a] px-4 py-2.5 text-xs font-semibold text-white">Publish</button>
          <button onClick={() => setStatus(review.id, "Hidden")} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-indigo-900">Hide</button>
          <button onClick={() => { setReplyId(replyId === review.id ? null : review.id); setReplySent(false); }} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-indigo-900">Reply</button>
        </div>
        {replyId === review.id && <form onSubmit={(event) => { event.preventDefault(); setReplyId(null); setReply(""); setReplySent(true); }} className="mt-4 flex flex-wrap gap-2"><label className="sr-only" htmlFor={`reply-${review.id}`}>Reply to {review.author}</label><input id={`reply-${review.id}`} required value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a public reply" className="h-10 min-w-[220px] flex-1 rounded-lg border border-slate-200 px-3 text-sm" /><button className="rounded-lg border bg-white px-4 text-xs font-semibold text-indigo-900">Post reply</button></form>}
        {replySent && <p role="status" className="mt-3 text-xs font-semibold text-emerald-700">Reply added to this demo review.</p>}
      </article>)}
      {!visible.length && <p className="rounded-lg bg-slate-50 p-6 text-sm text-slate-500">No reviews match this filter.</p>}
    </div></section>
    <aside className="mt-5 rounded-lg bg-[#f0efff] px-4 py-4"><p className="text-sm font-bold text-indigo-900">Moderation guidance</p><p className="mt-2 text-xs text-slate-500">Publish authentic feedback, including constructive criticism. Hide only spam, abusive content or personal information.</p></aside>
  </OperationsShell>;
}


