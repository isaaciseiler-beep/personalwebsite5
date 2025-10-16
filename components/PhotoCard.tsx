"use client";

import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

/**
 * Assumptions that match your existing cards:
 * - Each photo card is 440px tall on desktop (same as your Card/PhotoCard).
 * - Vertical gap between rows is 24px (gap-y-6).
 * Change ROW_H or GAP_Y to match future tweaks.
 */
const ROW_H = 440;     // px
const GAP_Y = 24;      // px
const TOTAL_H = ROW_H * 2 + GAP_Y;

/**
 * Fade math, expressed in absolute px so we can crop layout height precisely:
 * - Second row starts at 50% of TOTAL_H.
 * - Fade starts 20% into row 2 → 50% + 20% of row height.
 * - Fade ends   40% into row 2 → 50% + 40% of row height.
 */
const FADE_START = 0.5 * TOTAL_H + 0.2 * ROW_H; // px
const FADE_END   = 0.5 * TOTAL_H + 0.4 * ROW_H; // px
const CROP_H     = Math.round(FADE_END);        // section ends exactly where fade reaches full black

type Photo = {
  id: string;
  src: string;
  alt: string;
  label: string;
};

const photos: Photo[] = [
  { id: "1", src: "/photos/reykjavik.jpg", alt: "Reykjavik, Iceland", label: "Reykjavik, Iceland" },
  { id: "2", src: "/photos/hokitika.jpg", alt: "Hokitika, New Zealand", label: "Hokitika, New Zealand" },
  { id: "3", src: "/photos/gore-bay.jpg", alt: "Gore Bay, New Zealand", label: "Gore Bay, New Zealand" },
  // add more to fill two rows
];

export default function FeaturedPhotos() {
  return (
    <section
      aria-labelledby="featured-photos-heading"
      className="relative"
      style={{ height: CROP_H, overflow: "hidden" }} // hard crop at fade end
    >
      <div className="relative">
        <div className="mb-4 flex items-baseline justify-between px-4 sm:px-0">
          <h2 id="featured-photos-heading" className="text-3xl sm:text-4xl font-semibold">
            featured photos
          </h2>

          {/* This “see all” is hidden at top. The real CTA is in the fade band below. */}
          <Link
            href="/photos"
            className="sr-only"
          >
            see all
          </Link>
        </div>

        {/* Two rows of photos */}
        <div
          className={clsx(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6",
            "px-4 sm:px-0"
          )}
          style={{
            // Ensure each item is 440px tall, matching your Card/PhotoCard
            // If you swap to auto height, update the constants above and remove this.
            gridAutoRows: `${ROW_H}px`,
          }}
        >
          {photos.map((p) => (
            <figure
              key={p.id}
              className="relative overflow-hidden rounded-2xl"
              style={{ height: ROW_H }}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                className="object-cover"
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                priority={p.id === "1"}
              />
              <figcaption className="pointer-events-none absolute inset-x-4 bottom-4 rounded-full bg-gradient-to-r from-neutral-800/60 to-neutral-800/40 px-4 py-2 text-lg">
                {p.label}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Gradient veil + centered CTA.
            Mask after FADE_END. Gradient runs FADE_START→FADE_END. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0"
          style={{
            height: TOTAL_H, // overlay spans full intrinsic two-row height
            WebkitMaskImage: `linear-gradient(
              to bottom,
              black 0px,
              black ${FADE_START}px,
              rgba(0,0,0,0.0) ${FADE_START}px,  /* start easing */
              rgba(0,0,0,0.0) ${FADE_END}px,    /* end easing */
              transparent ${FADE_END}px         /* fully hidden below; we also hard-cropped layout to FADE_END */
            )`,
            maskImage: `linear-gradient(
              to bottom,
              black 0px,
              black ${FADE_START}px,
              rgba(0,0,0,0.0) ${FADE_START}px,
              rgba(0,0,0,0.0) ${FADE_END}px,
              transparent ${FADE_END}px
            )`,
          }}
        >
          {/* Solid black overlay beneath the mask */}
          <div className="absolute inset-0 bg-black" />
        </div>

        {/* Real CTA positioned within the fade band; pointer events enabled */}
        <div
          className="absolute inset-x-0 flex justify-center"
          style={{
            top: `${(FADE_START + FADE_END) / 2}px`,
            transform: "translateY(-50%)",
            pointerEvents: "auto",
          }}
        >
          <Link
            href="/photos"
            className="rounded-full border border-neutral-700 bg-neutral-900 px-5 py-2 text-sm font-medium hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-sky-500"
          >
            see all
          </Link>
        </div>
      </div>
    </section>
  );
}
