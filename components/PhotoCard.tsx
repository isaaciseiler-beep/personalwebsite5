// components/PhotoCard.tsx — FULL REPLACEMENT
"use client";

import Image from "next/image";
import type { Project } from "@/types/project";
import CursorTilt from "@/components/CursorTilt";

type Props = {
  item: Project; // kind: "photo"
  onClick?: (src: string, alt: string, caption?: string) => void;
};

export default function PhotoCard({ item, onClick }: Props) {
  const src = item.image || "";
  const alt = item.title || "photo";
  const caption = item.location || item.title;

  return (
    <button
      aria-label={`view ${alt}`}
      className="block w-full text-left"
      onClick={() => src && onClick?.(src, alt, caption)}
    >
      <CursorTilt maxTiltDeg={4} scale={1.015} className="h-full">
        <div className="card-hover relative aspect-square overflow-hidden rounded-xl border border-subtle bg-card">
          {src && (
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
              placeholder="empty"
            />
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2">
            <div className="rounded-full border border-subtle bg-[color:var(--color-bg)]/60 px-2 py-0.5 text-xs backdrop-blur">
              {caption}
            </div>
          </div>
        </div>
      </CursorTilt>
    </button>
  );
}
