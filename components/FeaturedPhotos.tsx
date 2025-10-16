"use client";

import Link from "next/link";
import PhotoCard from "@/components/PhotoCard";
import Reveal from "@/components/Reveal";
import { useState } from "react";
import { Lightbox } from "@/components/Lightbox";

// tune these to match your design
const GAP_Y = 24; // grid gap-y-6
const CARD_H_PX = 0; // unused with square aspect but kept for future; leave 0
const TOTAL_H = 2 * 0 + GAP_Y; // intrinsic height reference (not used for crop with squares)

// Fade positions measured within the SECOND ROW only:
// start at 20% into row 2, end at 40% into row 2.
const FADE_START_PERCENT = 0.20;
const FADE_END_PERCENT = 0.40;

type PhotoLike = any; // your photos array type

// Expect photos to be injected at call site; default fallback
const fallbackPhotos: PhotoLike[] = [];

export default function FeaturedPhotos({
  photos = fallbackPhotos,
}: {
  photos?: PhotoLike[];
}) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  /**
   * With square aspect cards, the height of one row equals the card width.
   * We compute crop height in CSS using a CSS variable that tracks a card size.
   * Implementation:
   *  - cards use aspect-square
   *  - we derive rowHeight from the first card’s width via CSS (grid auto-fit)
   *  - crop at row1 + 40% of row2
   */
  return (
    <section
      aria-labelledby="featured-photos-heading"
      className="relative"
    >
      <div className="mb-4 flex items-baseline justify-between px-4 sm:px-0">
        <h2 id="featured-photos-heading" className="text-3xl sm:text-4xl font-semibold">
          featured photos
        </h2>
        {/* top-right link hidden; real CTA lives in the fade */}
        <Link href="/photos" className="sr-only">
          see all
        </Link>
      </div>

      {/* Grid wrapper that defines a CSS variable for a card size */}
      <div
        className="relative px-4 sm:px-0"
      >
        <div
          className="relative grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6"
          style={{
            // Establish a custom property measuring one square card size at md (≈ column width).
            // Use 33vw for md+ (3 cols), 50vw for sm (2 cols), 100vw for 1 col,
            // then subtract gutters to approximate.
            // This drives the crop and gradient positions.
            // We clamp for stability.
            // @ts-ignore
            "--cardSize": "clamp(220px, 33vw, 480px)",
            // The crop height is: 1 row + 40% of 2nd row + vertical gap between rows
            // = var(--cardSize) * 1.40 + GAP_Y
            height: "calc((var(--cardSize) * 1.40) + 24px)",
            overflow: "hidden",
          } as React.CSSProperties}
        >
          {photos.map((item: PhotoLike, i: number) => (
            <Reveal key={(item as any).slug ?? i} delay={i * 0.06}>
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

          {/* Black overlay and fade band.
             Row 1 ends at 100% of cardSize.
             Fade starts at 100% + 20% of cardSize, ends at 100% + 40% of cardSize. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-full">
            {/* solid black below fade end */}
            <div
              className="absolute inset-x-0 top-0 h-full"
              style={{
                background:
                  "linear-gradient(to bottom, transparent calc(var(--cardSize) + (var(--cardSize) * 0.20)), black calc(var(--cardSize) + (var(--cardSize) * 0.40)))",
              }}
            />
            {/* smooth fade from transparent to black */}
            <div
              className="absolute inset-x-0 top-0 h-full"
              style={{
                background:
                  "linear-gradient(to bottom, transparent calc(var(--cardSize) + (var(--cardSize) * 0.20)), rgba(0,0,0,0.85) calc(var(--cardSize) + (var(--cardSize) * 0.40)))",
                mixBlendMode: "multiply",
              }}
            />
          </div>

          {/* Centered CTA within the fade band; pointer events enabled */}
          <div
            className="absolute inset-x-0 flex justify-center"
            style={{
              top:
                "calc(var(--cardSize) + (var(--cardSize) * ((0.20 + 0.40) / 2)))",
              transform: "translateY(-50%)",
              pointerEvents: "auto",
            }}
          >
            <Link
              href="/photos"
              className="rounded-full border border-white/15 bg-neutral-950/90 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-sky-500"
            >
              see all
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox for click-throughs */}
      <Lightbox
        open={open}
        onClose={() => setOpen(false)}
        images={photos.map((p: any) => ({
          src: p.image ?? p.src ?? p.photo,
          alt: p.alt ?? p.title ?? p.label ?? "photo",
        }))}
        index={idx}
        onIndexChange={setIdx}
      />
    </section>
  );
}
