"use client";

import Image from "next/image";
import type { Project } from "@/types/project";
import CardMotion from "@/components/CardMotion";

/**
 * PhotoCard
 * Reintroduces top-left translucent pill and bottom caption.
 * Rounded corners and smooth tilt unified via CardMotion.
 */
type Props = {
  item: Project;
  onClick?: (src: string, alt: string, caption?: string) => void;
  ratio?: "square" | "video";
};

export default function PhotoCard({ item, onClick, ratio = "square" }: Props) {
  const src = (item as any)?.image ?? "";
  const alt = item.title ?? "photo";
  const caption =
    (item as any)?.description ??
    (item as any)?.caption ??
    (item as any)?.location ??
    undefined;
  const tag =
    (item as any)?.location ??
    (item as any)?.category ??
    (item as any)?.role ??
    undefined;
  const aspectClass = ratio === "video" ? "aspect-video" : "aspect-square";

  return (
    <button
      aria-label={`view ${alt}`}
      className="card-focusable block w-full text-left"
      onClick={() => src && onClick?.(src, alt, caption)}
    >
      <CardMotion maxTiltDeg={3} scale={1.008} className="h-full rounded-2xl">
        <div
          className={`relative ${aspectClass} overflow-hidden rounded-2xl border border-subtle bg-card`}
        >
          {src ? (
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(min-width:768px) 33vw, 100vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.02]"
            />
          ) : (
            <div className="h-full w-full bg-neutral-800" />
          )}

          {/* translucent pill */}
          {tag && (
            <div className="absolute left-2 top-2 rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[11px] text-white/90 backdrop-blur-[6px]">
              {tag}
            </div>
          )}

          {/* caption gradient */}
          {caption && (
            <div className="absolute inset-x-0 bottom-0 p-3 text-xs text-white/90 backdrop-blur-[8px] bg-gradient-to-t from-black/40 via-black/15 to-transparent">
              {caption}
            </div>
          )}
        </div>
      </CardMotion>
    </button>
  );
}
