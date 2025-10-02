"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/types/project";

type CardProps = {
  item: Project;
  onPhotoClick?: (src: string, alt: string) => void;
};

export function Card({ item, onPhotoClick }: CardProps) {
  const content = (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ duration: 0.12, ease: [0.2, 0, 0, 1] }}
    >
      <div className="card-hover flex h-full flex-col overflow-hidden rounded-xl border border-subtle bg-card">
        {item.image && (
          <Image
            src={item.image}
            alt={item.title}
            width={800}
            height={600}
            className="h-48 w-full object-cover"
            loading="lazy"
          />
        )}
        <div className="flex flex-1 flex-col p-4">
          <div className="text-sm uppercase tracking-wide text-muted">
            {item.kind}
          </div>
          <h3 className="mt-1 text-lg">{item.title}</h3>
          {item.summary && (
            <p className="mt-2 text-sm text-muted flex-1">{item.summary}</p>
          )}
          {item.tags && (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-subtle px-2 py-0.5 text-xs text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (item.kind === "photo" && onPhotoClick && item.image) {
    return (
      <button
        aria-label={`view ${item.title}`}
        className="text-left h-full"
        onClick={() => onPhotoClick(item.image!, item.title)}
      >
        {content}
      </button>
    );
  }

  if (item.url) {
    return (
      <Link href={item.url} target="_blank" rel="noopener noreferrer" className="h-full">
        {content}
      </Link>
    );
  }

  return <div className="h-full">{content}</div>;
}
