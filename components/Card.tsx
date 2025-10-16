"use client";

import Link from "next/link";
import ShimmerImage from "@/components/ShimmerImage";
import type { Project } from "@/types/project";
import CardMotion from "@/components/CardMotion";

type CardProps = { item: Project; onPhotoClick?: (src: string, alt: string) => void };

export function Card({ item, onPhotoClick }: CardProps) {
  const tagline: string | undefined =
    (item as any)?.tagline ?? (item as any)?.subtitle ?? undefined;

  const meta =
    tagline ??
    ((item as any)?.category as string | undefined) ??
    ((item as any)?.type as string | undefined) ??
    ((item as any)?.role as string | undefined) ??
    "";

  const body = (
    <CardMotion className="h-full">
      <div className="relative flex h-[440px] flex-col overflow-hidden rounded-xl border border-subtle bg-card">
        {"image" in item && (item as any).image ? (
          <ShimmerImage
            src={(item as any).image as string}
            alt={item.title}
            width={800}
            height={480}
            className="h-48 w-full object-cover"
            priority={false}
          />
        ) : null}

        <div className="flex flex-1 flex-col gap-2 p-4">
          {meta ? <div className="text-sm text-muted">{meta}</div> : null}
          <div className="text-base font-medium leading-tight">{item.title}</div>
          {"description" in item && (item as any).description ? (
            <p className="mt-1 line-clamp-3 text-sm text-muted">{(item as any).description}</p>
          ) : null}
          {Array.isArray((item as any).tags) && (item as any).tags.length > 0 ? (
            <div className="mt-auto flex flex-wrap gap-2">
              {(item as any).tags.map((t: string) => (
                <span
                  key={t}
                  className="rounded-full border border-subtle/70 px-2 py-0.5 text-xs text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </CardMotion>
  );

  if (item.kind === "photo" && onPhotoClick && (item as any).image) {
    return (
      <button
        aria-label={`view ${item.title}`}
        className="card-focusable block h-full text-left"
        onClick={() => onPhotoClick((item as any).image as string, item.title)}
      >
        {body}
      </button>
    );
  }

  if (item.kind === "project") {
    if ((item as any).url) {
      return (
        <Link
          href={(item as any).url as string}
          target="_blank"
          rel="noopener noreferrer"
          className="card-focusable block h-full"
        >
          {body}
        </Link>
      );
    }
    return (
      <Link href={`/work/projects/${item.slug}`} className="prefetch card-focusable block h-full">
        {body}
      </Link>
    );
  }

  return <div className="h-full">{body}</div>;
}

export default Card;
