"use client";

import Image from "next/image";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  function go(step: number) {
    setIndex((current) => (current + step + images.length) % images.length);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line/70 bg-white p-3 shadow-card sm:p-4">
        <button
          onClick={() => setExpanded(true)}
          className="block w-full overflow-hidden rounded-xl bg-surface"
          aria-label="Expand image"
        >
          <Image
            src={images[index]}
            alt={`${name} · image ${index + 1}`}
            width={1000}
            height={1000}
            priority
            className="aspect-square w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
        </button>
        {images.length > 1 && (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {images.map((image, i) => (
              <button
                key={image}
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1}`}
                aria-pressed={i === index}
                className={`overflow-hidden rounded-lg border-2 bg-surface ${
                  i === index ? "border-primary" : "border-transparent"
                }`}
              >
                <Image src={image} alt="" width={240} height={240} className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {expanded && (
        <div className="rounded-2xl border border-line/70 bg-white p-4 shadow-card sm:p-6">
          <p className="font-bold text-ink">Expanded gallery · {name}</p>
          <Image
            src={images[index]}
            alt={`${name} enlarged`}
            width={1400}
            height={1400}
            className="mt-4 aspect-[4/3] w-full rounded-xl object-cover"
            sizes="100vw"
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <Button variant="secondary" onClick={() => go(-1)} disabled={images.length < 2}>
              ← Previous
            </Button>
            <p className="text-sm text-muted">
              Image {index + 1} of {images.length}
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => go(1)} disabled={images.length < 2}>
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
