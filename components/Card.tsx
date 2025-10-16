"use client";

import Link from "next/link";
import ShimmerImage from "@/components/ShimmerImage";
import type { Project } from "@/types/project";
import CardMotion from "@/components/CardMotion";

/**
 * ProjectCard
 * – clean hierarchy, subtle parallax cover
 * – harmonized with PhotoCard look
 */
type CardProps = { item: Project; onPhotoClick?: (src: string, alt: string) => void };

export function Card({ item, onPhotoClick }: CardProps) {
  const tagline =
    (item as any)?.tagline ??
    (item as any)?.subtitle ??
    (item as any)?.category ??
    "";
  const img = (item as any)?.image ?? "";
  const desc = (item as any)?.description ?? "";
  const tags = (item as any)?.tags ?? [];
  const meta = tagline;

  const content = (
    <CardMotion maxTiltDeg={4} scale={1.012} className="h-full rounded-2xl">
      <div className="relative flex h-[440px] flex-col overflow-hidden rounded-2xl border border-subtle bg-card transition-colors duration-700">
        {img && (
          <div className="relative h-48 overflow-hidden">
            <ShimmerImage
              src={img}
              alt={item.title}
              width={800}
              height={480}
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.03]"
            />
            {/* gradient overlay for depth */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/25 opacity-60" />
          </div>
        )}

        <div className="flex flex-1 flex-col gap-2 p-5">
          {meta && (
            <div className="text-sm font-medium text-muted tracking-tight">
              {meta}
            </div>
          )}
          <div className="text-lg font-semibold leading-tight text-fg/95">
            {item.title}
          </div>
          {desc && (
            <p className="mt-1 line-clamp-3 text-sm text-muted/90 leading-snug">
              {desc}
            </p>
          )}
          {Array.isArray(tags) && tags.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-2">
              {tags.map((t: string) => (
                <span
                  key={t}
                  className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-white/70 backdrop-blur-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </CardMotion>
  );

  // routing logic
  if (item.kind === "photo" && onPhotoClick && img) {
    return (
      <button
        aria-label={`view ${item.title}`}
        className="block h-full text-left card-focusable"
        onClick={() => onPhotoClick(img, item.title)}
      >
        {content}
      </button>
    );
  }

  if (item.kind === "project") {
    const href = (item as any)?.url || `/work/projects/${item.slug}`;
    const external = Boolean((item as any)?.url);
    return (
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="block h-full card-focusable"
      >
        {content}
      </Link>
    );
  }

  return <div className="h-full">{content}</div>;
}

export default Card;
