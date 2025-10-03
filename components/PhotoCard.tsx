// components/PhotoCard.tsx — FULL REPLACEMENT
"use client";

import Image from "next/image";
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
        {src && (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            // optional: ultra-light placeholder to reduce jarring loads
            placeholder="empty"
            priority={false}
          />
        )}

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
