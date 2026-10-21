"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  adminCreateImage,
  adminDeleteImage,
  adminErrorMessage,
  adminFieldErrors,
  adminListImages,
  adminPatchImage,
} from "@/services/admin";
import type { BackendProductImage } from "@/types";

const field = "mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal";

// Loads the pasted link in the browser and says whether it really is an image.
// A Google search result page or a product web page is not an image and will never display.
export function ImageLinkPreview({ url }: { url: string }) {
  const [state, setState] = useState<"idle" | "loading" | "ok" | "bad">("idle");
  const trimmed = url.trim();

  useEffect(() => {
    if (!/^https?:\/\//i.test(trimmed)) {
      setState("idle");
      return;
    }
    let cancelled = false;
    setState("loading");
    const probe = new window.Image();
    probe.onload = () => {
      if (!cancelled) setState("ok");
    };
    probe.onerror = () => {
      if (!cancelled) setState("bad");
    };
    probe.src = trimmed;
    return () => {
      cancelled = true;
    };
  }, [trimmed]);

  if (state === "idle") return null;
  if (state === "loading") return <span className="mt-1 block text-[11px] font-normal text-slate-500">Checking link…</span>;
  if (state === "bad") {
    return (
      <span role="alert" className="mt-1 block text-[11px] font-normal text-rose-700">
        This link is not an image file, so it will not display in the store. Open the picture, right-click it and choose
        “Copy image address” (the link should end in .jpg, .png or .webp).
      </span>
    );
  }
  return (
    <span className="mt-2 flex items-center gap-2 text-[11px] font-normal text-emerald-700">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={trimmed} alt="" className="h-10 w-10 rounded object-cover" /> Image link looks good.
    </span>
  );
}

// The admin image list and ?product= filter are live-verified; image write methods remain unverified.
export default function ProductImagesPanel({ productId }: { productId: number }) {
  const [images, setImages] = useState<BackendProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  const [primary, setPrimary] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const list = await adminListImages({ product: productId });
      setImages(list.filter((image) => !image.product || Number(image.product) === productId));
    } catch (e) {
      setError(adminErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function add(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await adminCreateImage({ product: productId, image_url: url.trim(), is_primary: primary });
      setUrl("");
      setPrimary(false);
      await load();
      setMessage("Image added.");
    } catch (e) {
      const details = adminFieldErrors(e);
      setMessage(Object.values(details)[0] ?? adminErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  async function makePrimary(image: BackendProductImage) {
    setMessage("");
    try {
      await adminPatchImage(image.image_id, { is_primary: true });
      await load();
    } catch (e) {
      setMessage(adminErrorMessage(e));
    }
  }

  async function remove(image: BackendProductImage) {
    if (!window.confirm("Remove this image?")) return;
    setMessage("");
    try {
      await adminDeleteImage(image.image_id);
      await load();
    } catch (e) {
      setMessage(adminErrorMessage(e));
    }
  }

  return (
    <div className="mt-6 border-t border-slate-100 pt-5">
      <h3 className="text-sm font-bold">Images</h3>
      {loading ? (
        <p role="status" className="mt-3 text-xs text-slate-500">Loading images…</p>
      ) : error ? (
        <p role="alert" className="mt-3 text-xs text-rose-700">{error}<button onClick={() => void load()} className="ml-3 underline">Retry</button></p>
      ) : images.length === 0 ? (
        <p className="mt-3 text-xs text-slate-500">No images yet. Add an image URL below.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {images.map((image) => (
            <li key={image.image_id} className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 p-2 text-xs">
              {/* Plain img: admin image hosts are not known ahead of time for next/image. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.image_url} alt="" className="h-12 w-12 rounded object-cover" />
              <span className="min-w-0 flex-1 truncate" title={image.image_url}>{image.image_url}</span>
              {image.is_primary ? (
                <span className="rounded-full bg-[#efefff] px-2 py-1 font-semibold text-indigo-900">Primary</span>
              ) : (
                <button type="button" onClick={() => void makePrimary(image)} className="text-indigo-800">Make primary</button>
              )}
              <button type="button" onClick={() => void remove(image)} className="text-rose-700">Delete</button>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={add} className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <label className="text-xs font-semibold">
          Image URL
          <input type="url" required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/image.jpg" className={field} />
          <ImageLinkPreview url={url} />
        </label>
        <label className="flex items-center gap-2 pb-2 text-xs">
          <input type="checkbox" checked={primary} onChange={(e) => setPrimary(e.target.checked)} />
          Primary
        </label>
        <button disabled={busy} className="rounded-lg bg-[#10139a] px-4 py-3 text-xs text-white disabled:opacity-60">{busy ? "Adding…" : "Add image"}</button>
      </form>
      {message && <p role="status" className="mt-2 text-xs text-slate-600">{message}</p>}
    </div>
  );
}
