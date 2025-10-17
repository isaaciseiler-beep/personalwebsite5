// components/FeaturedPhotos.tsx — FULL REPLACEMENT
"use client";

import Reveal from "@/components/Reveal";
import PhotoCard from "@/components/PhotoCard";
import { useState } from "react";
import { Lightbox } from "@/components/Lightbox";
import Link from "next/link";
import type { Project } from "@/types/project";

export default function FeaturedPhotos({ photos }: { photos: Project[] }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const gallery = photos.map((p) => ({
    src: p.image ?? "",
    alt: p.title,
    caption: p.location || p.title,
  }));

  return (
    <section className="py-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl">featured photos</h2>
          <Link
            href="/work/photos"
            className="link-underline text-sm text-muted hover:text-[color:var(--color-accent)]"
            prefetch
          >
            see all
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {photos.map((item, i) => (
            <Reveal key={item.slug} delay={i * 0.06}>
              <PhotoCard
                item={item}
                ratio="square"
                onClick={() => {
                  setIdx(i);
                  setOpen(true);
                }}
              />
            </Reveal>
          ))}
        </div>
      </div>

      <Lightbox
        open={open}
        items={gallery}
        index={idx}
        setIndex={setIdx}
        onClose={() => setOpen(false)}
      />
    </section>
  );
}
