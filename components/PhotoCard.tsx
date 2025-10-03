// components/PhotoCard.tsx — FULL REPLACEMENT (plain <img>, squares, cover)
"use client";

import type { Project } from "@/types/project";

type Props = {
  item: Project;                    // kind: "photo"
  onClick?: (src: string, alt: string) => void;
};

export default function PhotoCard({ item, onClick }: Props) {
  const src = item.image || "";
  const alt = item.title || "photo";

  return (
    <button
      aria-label={`view ${alt}`}
      className="block w-full text-left"
      onClick={() => src && onClick?.(src, alt)}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl border border-subtle bg-card">
        {/* render plain <img> so external R2 URLs always show */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={(e) => {
            // subtle fallback if a URL is wrong
            const el = e.currentTarget as HTMLImageElement;
            el.style.objectFit = "contain";
            el.src =
              "data:image/svg+xml;utf8," +
              encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='100%' height='100%' fill='black'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='system-ui' font-size='14'>image not found</text></svg>`
              );
          }}
        />

        {/* location/title badge */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2">
          <div className="rounded-full border border-subtle bg-[color:var(--color-bg)]/60 px-2 py-0.5 text-xs backdrop-blur">
            {item.location || alt}
          </div>
        </div>
      </div>
    </button>
  );
}
