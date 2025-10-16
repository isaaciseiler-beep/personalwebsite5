"use client";

import Link from "next/link";
import ShimmerImage from "@/components/ShimmerImage";
import type { Project } from "@/types/project";
import CardMotion from "@/components/CardMotion";

type CardProps = { item: Project; onPhotoClick?: (src: string, alt: string) => void };

export function Card({ item, onPhotoClick }: CardProps) {
  const body = (
    <CardMotion className="h-full">
      <div className="relative flex h-[440px] flex-col overflow-hidden rounded-xl border border-subtle bg-card">
        {item.image && (
          <ShimmerImage
            src={item.image}
            alt={item.title}
            width={800}
            height={480}
            className="h-48 w-full object-cover"
            priority={false}
          />
        )}

        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="text-sm text-muted">{item.tagline || item.category}</div>
          <div className="text-base font-medium leading-tight">{item.title}</div>
          {item.description && (
            <p className="mt-1 line-clamp-3 text-sm text-muted">{item.description}</p>
          )}
          {Array.isArray(item.tags) && item.tags.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-subtle/70 px-2 py-0.5 text-xs text-muted"
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

  if (item.kind === "photo" && onPhotoClick && item.image) {
    return (
      <button
        aria-label={`view ${item.title}`}
        className="block h-full text-left"
        onClick={() => onPhotoClick(item.image!, item.title)}
      >
        {body}
      </button>
    );
  }

  if (item.kind === "project") {
    if (item.url)
      return (
        <Link href={item.url} target="_blank" rel="noopener noreferrer" className="block h-full">
          {body}
        </Link>
      );
    return (
      <Link href={`/work/projects/${item.slug}`} className="block h-full prefetch">
        {body}
      </Link>
    );
  }

  return <div className="h-full">{body}</div>;
}

export default Card;
