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

  return (
    <button
      aria-label={`view ${item.title}`}
      className="block w-full text-left"
      onClick={() => onClick?.(src, item.title)}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl border border-subtle bg-card">
        {/* image fills the square; centered */}
        {src && (
          <Image
            src={src}
            alt={item.title}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
            priority={false}
          />
        )}
        {/* bottom label */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2">
          <div className="rounded-full border border-subtle bg-[color:var(--color-bg)]/60 px-2 py-0.5 text-xs backdrop-blur">
            {item.location || item.title}
          </div>
        </div>
      </div>
    </button>
  );
}
