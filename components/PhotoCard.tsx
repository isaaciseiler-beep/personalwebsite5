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
  ratio?: Ratio; // default square for home grid
};

const ratioClass: Record<Ratio, string> = {
  video: "aspect-[16/9]",
  square: "aspect-square",
  photo: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
};

export default function PhotoCard({ item, onClick, className, ratio = "square" }: Props) {
  const src = (item as any).image ?? (item as any).src ?? (item as any).photo ?? "/placeholder.png";
  const alt = (item as any).alt ?? (item as any).title ?? "photo";
  // location FIRST; fall back to nothing (not title) so pills don't show the name
  const location = (item as any).location ?? "";

  return (
    <CursorTilt className="h-full">
      <figure
        onClick={onClick}
        className={clsx(
          "group relative overflow-hidden rounded-2xl border border-subtle bg-card",
          "transition-all duration-300 will-change-transform shadow-sm hover:shadow-xl hover:-translate-y-0.5",
          ratioClass[ratio],
          onClick && "cursor-pointer",
          className
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          priority
        />

        {/* subtle top gradient */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/25 to-transparent" />

        {/* slim location pill */}
        {location ? (
          <figcaption className="pointer-events-none absolute inset-x-4 bottom-4">
            <span className="rounded-full px-2.5 py-1 text-xs text-neutral-100 bg-neutral-900/70 ring-1 ring-white/10 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md">
              {location}
            </span>
          </figcaption>
        ) : null}

        {/* focus ring */}
        <span className="absolute inset-0 rounded-2xl ring-0 ring-sky-500/0 transition group-focus-within:ring-2 group-focus-within:ring-sky-500/60" />
      </figure>
    </CursorTilt>
  );
}
