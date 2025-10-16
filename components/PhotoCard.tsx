"use client";

import Image from "next/image";
import type { Project } from "@/types/project";
import CardMotion from "@/components/CardMotion";

type Props = {
  item: Project; // kind: "photo"
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

  const aspectClass = ratio === "video" ? "aspect-video" : "aspect-square";

  return (
    <button
      aria-label={`view ${alt}`}
      className="card-focusable block w-full text-left"
      onClick={() => src && onClick?.(src, alt, caption)}
    >
      <CardMotion maxTiltDeg={4} scale={1.015} className="h-full">
        <div className={`relative ${aspectClass} overflow-hidden rounded-xl border border-subtle bg-card`}>
          {src ? (
            <Image src={src} alt={alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
          ) : (
            <div className="h-full w-full bg-neutral-800" />
          )}
          {caption ? (
            <div className="absolute inset-x-0 bottom-0 p-3 text-xs text-fg/90 backdrop-blur-sm">
              {caption}
            </div>
          ) : null}
        </div>
      </CardMotion>
    </button>
  );
}
