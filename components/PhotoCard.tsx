"use client";

import type { Project } from "@/types/project";
import Image from "next/image";
import clsx from "clsx";

type Props = {
  item: Project;
  onClick?: () => void;
  className?: string;
};

export default function PhotoCard({ item, onClick, className }: Props) {
  // Defensive fallbacks for differing project shapes
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
    <figure
      onClick={onClick}
      className={clsx(
        "relative h-[440px] overflow-hidden rounded-2xl border border-subtle bg-card",
        onClick && "cursor-pointer",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
        priority
      />
      {label ? (
        <figcaption className="pointer-events-none absolute inset-x-4 bottom-4 rounded-full bg-neutral-800/60 px-4 py-2 text-lg">
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}
