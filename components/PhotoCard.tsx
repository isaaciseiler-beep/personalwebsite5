"use client";

import Image from "next/image";
import type { Project } from "@/types/project";
import CardMotion from "@/components/CardMotion";

/**
 * PhotoCard
 * - Bottom full-width *pill* (rounded-full), text left.
 * - No corner bleed on hover (hard clip + mask).
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
      <CardMotion maxTiltDeg={3.5} scale={1.01} className="h-full rounded-2xl">
        <div
          className={`relative ${aspectClass} rounded-2xl border border-subtle bg-card`}
          // Safari + Chrome GPU-safe clipping (prevents bottom-corner bleed)
          style={{
            overflow: "hidden",
            clipPath: "inset(0 round 16px)", // matches rounded-2xl
            WebkitMaskImage: "linear-gradient(#000,#000)",
            maskImage: "linear-gradient(#000,#000)",
            contain: "paint", // isolates paints for scaling children
          }}
        >
          {/* hard clip wrapper to ensure scaled image never overflows corners */}
          <div className="absolute inset-0 will-change-transform">
            {src ? (
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(min-width:768px) 33vw, 100vw"
                className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.022]"
                priority={false}
              />
            ) : (
              <div className="h-full w-full bg-neutral-800" />
            )}
          </div>

          {/* full-width bottom pill (rounded-full), text left */}
          {location && (
            <div
              className="pointer-events-none absolute left-2 right-2 bottom-2 z-10 flex min-h-[36px] items-center rounded-full border border-white/18 bg-white/10 px-3 text-[13px] font-medium text-white/92 backdrop-blur-[10px]"
              // keep ends perfectly round when container is very narrow
              style={{ clipPath: "inset(0 round 999px)" }}
            >
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>
      </CardMotion>
    </button>
  );
}
