"use client";

import type { Project } from "@/types/project";
import Image from "next/image";
import clsx from "clsx";
import CursorTilt from "@/components/CursorTilt";

type Ratio = "video" | "square" | "photo" | "portrait";

type Props = {
  item: Project;
  onClick?: () => void;
  className?: string;
  ratio?: Ratio; // default "square" for Featured grid
};

const ratioClassMap: Record<Ratio, string> = {
  video: "aspect-[16/9]",
  square: "aspect-square",
  photo: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
};

export default function PhotoCard({
  item,
  onClick,
  className,
  ratio = "square",
}: Props) {
  // tolerant field mapping
  const src =
    (item as any).image ??
    (item as any).src ??
    (item as any).photo ??
    "/placeholder.png";
  const alt =
    (item as any).alt ?? (item as any).title ?? (item as any).label ?? "photo";
  const label =
    (item as any).label ?? (item as any).title ?? (item as any).location ?? "";

  return (
    <CursorTilt className="h-full">
      <figure
        onClick={onClick}
        className={clsx(
          "group relative overflow-hidden rounded-2xl border border-subtle bg-card",
          "transition-all duration-300 will-change-transform",
          "shadow-sm hover:shadow-xl hover:-translate-y-0.5",
          ratioClassMap[ratio],
          onClick && "cursor-pointer",
          className
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={clsx(
            "object-cover",
            "transition-transform duration-500 group-hover:scale-[1.03]"
          )}
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          priority
        />

        {/* subtle top gradient for premium feel */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent" />

        {/* location pill */}
        {label ? (
          <figcaption
            className={clsx(
              "pointer-events-none absolute inset-x-4 bottom-4",
              "flex justify-start"
            )}
          >
            <span className="rounded-full bg-neutral-900/70 px-3 py-1.5 text-sm text-neutral-100 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md ring-1 ring-white/10">
              {label}
            </span>
          </figcaption>
        ) : null}

        {/* focus ring */}
        <span className="absolute inset-0 rounded-2xl ring-0 ring-sky-500/0 transition group-focus-within:ring-2 group-focus-within:ring-sky-500/60" />
      </figure>
    </CursorTilt>
  );
}
