"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { cx } from "@/components/ui";

export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  group: string;
}

export function Gallery({ images }: { images: GalleryImage[] }) {
  const groups = ["All", ...Array.from(new Set(images.map((image) => image.group)))];
  const [group, setGroup] = useState("All");
  const [active, setActive] = useState<number | null>(null);

  const visible = group === "All" ? images : images.filter((image) => image.group === group);

  const step = useCallback(
    (direction: number) => {
      setActive((current) => {
        if (current === null) return current;
        const next = (current + direction + visible.length) % visible.length;
        return next;
      });
    },
    [visible.length],
  );

  useEffect(() => {
    if (active === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [active, step]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {groups.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setGroup(item);
              setActive(null);
            }}
            className={cx(
              "min-h-10 rounded-full border px-4 py-2 text-sm transition-colors",
              group === item
                ? "border-red bg-red text-white"
                : "border-line bg-white text-ink/70 hover:border-ink/30",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActive(index)}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-paper text-left"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-4 text-sm text-white">
              {image.caption}
            </span>
          </button>
        ))}
      </div>

      {active !== null && visible[active] ? (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-ink/92 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={visible[active].caption}
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            aria-label="Close gallery"
            onClick={() => setActive(null)}
            className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
              <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Previous image"
            onClick={(event) => {
              event.stopPropagation();
              step(-1);
            }}
            className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white sm:left-8"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
              <path d="m12 4-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <figure
            className="max-h-full w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl">
              <Image
                src={visible[active].src}
                alt={visible[active].alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-4 text-center text-sm text-white/70">
              {visible[active].caption}
              <span className="ml-2 text-white/40">
                {active + 1} / {visible.length}
              </span>
            </figcaption>
          </figure>

          <button
            type="button"
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation();
              step(1);
            }}
            className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white sm:right-8"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
              <path d="m8 4 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}
