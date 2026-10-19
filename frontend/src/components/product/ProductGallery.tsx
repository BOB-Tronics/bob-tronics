"use client";

import Image from "next/image";
import { useState } from "react";
import Button from "@/components/ui/Button";

function ImagePlaceholder({ label, className }: { label: string; className: string }) {
  return <div role="img" aria-label={`${label} image unavailable`} className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className}`}>
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/></svg>
  </div>;
}

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const availableImages = images.filter((image) => typeof image === "string" && image.trim().length > 0);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const image = availableImages[index];
  const imageFailed = !image || failedImages.includes(image);
  const isLocalImage = image?.startsWith("/") ?? false;

  function markImageFailed(src: string) {
    setFailedImages((current) => current.includes(src) ? current : [...current, src]);
  }

  function go(step: number) {
    if (!availableImages.length) return;
    setIndex((current) => (current + step + availableImages.length) % availableImages.length);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line/70 bg-white p-3 shadow-card sm:p-4">
        <button
          onClick={() => setExpanded(true)}
          className="block w-full overflow-hidden rounded-xl bg-surface"
          aria-label="Expand image"
        >
          {imageFailed ? <ImagePlaceholder label={name} className="aspect-square w-full" /> : <Image
            src={image}
            alt={`${name} · image ${index + 1}`}
            width={1000}
            height={1000}
            priority
            unoptimized={!isLocalImage}
            onError={() => markImageFailed(image)}
            className="aspect-square w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />}
        </button>
        {availableImages.length > 1 && (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {availableImages.map((image, i) => (
              <button
                key={image}
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1}`}
                aria-pressed={i === index}
                className={`overflow-hidden rounded-lg border-2 bg-surface ${
                  i === index ? "border-primary" : "border-transparent"
                }`}
              >
                {failedImages.includes(image) ? <ImagePlaceholder label={name} className="aspect-square w-full" /> : <Image src={image} alt="" width={240} height={240} unoptimized={!image.startsWith("/")} onError={() => markImageFailed(image)} className="aspect-square w-full object-cover" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {expanded && (
        <div className="rounded-2xl border border-line/70 bg-white p-4 shadow-card sm:p-6">
          <p className="font-bold text-ink">Expanded gallery · {name}</p>
          {imageFailed ? <ImagePlaceholder label={name} className="mt-4 aspect-[4/3] w-full rounded-xl" /> : <Image
            src={image}
            alt={`${name} enlarged`}
            width={1400}
            height={1400}
            unoptimized={!isLocalImage}
            onError={() => markImageFailed(image)}
            className="mt-4 aspect-[4/3] w-full rounded-xl object-cover"
            sizes="100vw"
          />}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <Button variant="secondary" onClick={() => go(-1)} disabled={availableImages.length < 2}>
              ← Previous
            </Button>
            <p className="text-sm text-muted">
              Image {index + 1} of {availableImages.length}
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => go(1)} disabled={availableImages.length < 2}>
                Next →
              </Button>
              <Button onClick={() => setExpanded(false)}>Close ×</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
