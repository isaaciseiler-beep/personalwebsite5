"use client";

import Image from "next/image";
import type { Project } from "@/types/project";
import CardMotion from "@/components/CardMotion";

/**
 * PhotoCard — unified smooth tilt with full-width bottom pill
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
    undefined;
  const aspectClass = ratio === "video" ? "aspect-video" : "aspect-square";

  return (
    <button
      aria-label={`view ${alt}`}
      className="card-focusable block w-full text-left"
      onClick={() => src && onClick?.(src, alt, location)}
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

          {/* full-width translucent bottom pill */}
          {location && (
            <div className="absolute inset-x-0 bottom-0 flex items-center px-3 py-1.5 text-[13px] text-white/90 backdrop-blur-[8px] bg-[rgba(255,255,255,0.10)] border-t border-white/15">
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>
      </CardMotion>
    </button>
  );
}
