"use client";

import Image from "next/image";
import type { Project } from "@/types/project";
import CardMotion from "@/components/CardMotion";

/**
 * PhotoCard
 * Refined photographic surface:
 * – micro parallax (image depth)
 * – full-width translucent location bar
 * – ultra-smooth easing + consistent luminance
 */
type Props = {
  item: Project;
  onClick?: (src: string, alt: string, caption?: string) => void;
  ratio?: "square" | "video";
};

export default function PhotoCard({ item, onClick, ratio = "square" }: Props) {
  const src = (item as any)?.image ?? "";
  const alt = item.title ?? "photo";
  const location =
    (item as any)?.location ??
    (item as any)?.category ??
    (item as any)?.role ??
    "";
  const aspectClass = ratio === "video" ? "aspect-video" : "aspect-square";

  return (
    <button
      aria-label={`view ${alt}`}
      className="card-focusable block w-full text-left"
      onClick={() => src && onClick?.(src, alt, location)}
    >
      <CardMotion maxTiltDeg={4} scale={1.012} className="h-full rounded-2xl">
        <div
          className={`relative ${aspectClass} overflow-hidden rounded-2xl border border-subtle bg-card`}
        >
          {src ? (
            <Image
              src={src}
              alt={alt}
              fill
              priority={false}
              sizes="(min-width:768px) 33vw, 100vw"
              className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.025] will-change-transform"
            />
          ) : (
            <div className="h-full w-full bg-neutral-800" />
          )}

          {/* luminous bottom bar */}
          {location && (
            <div className="absolute inset-x-0 bottom-0 flex items-center px-4 py-2 text-[13px] font-medium text-white/90 backdrop-blur-[12px] bg-[rgba(255,255,255,0.10)] border-t border-white/10 shadow-[0_-8px_24px_rgba(0,0,0,0.25)_inset]">
              <span className="truncate tracking-tight">{location}</span>
            </div>
          )}
        </div>
      </CardMotion>
    </button>
  );
}
