"use client";

import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import type { Project } from "@/types/project";

type CardProps = {
  item: Project;
  onPhotoClick?: (src: string, alt: string) => void;
};

export function Card({ item, onPhotoClick }: CardProps) {
  const body = (
    <m.div
      whileHover={{ y: -2, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 260, damping: 24, mass: 0.6 }}
      className="h-full"
    >
      <div className="card-hover flex h-[440px] flex-col overflow-hidden rounded-xl border border-subtle bg-card">
        {item.image && (
          <Image
            src={item.image}
            alt={item.title}
            width={800}
            height={600}
            className="h-56 w-full object-cover"
            loading="lazy"
          />
        )}
        <div className="flex min-h-0 flex-1 flex-col p-4">
          <div className="text-sm uppercase tracking-wide text-muted">{item.kind}</div>
          <h3 className="mt-1 text-lg">{item.title}</h3>
          {item.summary && <p className="mt-2 flex-1 text-sm text-muted line-clamp-2">{item.summary}</p>}
          {item.tags && (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <span key={t} className="rounded-full border border-subtle px-2 py-0.5 text-xs text-muted">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </m.div>
  );

  if (item.kind === "photo" && onPhotoClick && item.image) {
    return (
      <button aria-label={`view ${item.title}`} className="block h-full text-left" onClick={() => onPhotoClick(item.image!, item.title)}>
        {body}
      </button>
    );
  }
  if (item.url) return <Link href={item.url} target="_blank" rel="noopener noreferrer" className="block h-full">{body}</Link>;
  return <div className="h-full">{body}</div>;
}
