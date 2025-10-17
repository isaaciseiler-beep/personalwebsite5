"use client";

import { memo, useMemo } from "react";
import ShimmerImage from "@/components/ShimmerImage";
import CursorTilt from "@/components/CursorTilt";

type PhotoLike = {
  src?: string;
  alt?: string;
  image?: string;
  title?: string;
  tags?: string[];
  keywords?: string[];
  stack?: string[];
  location?: string;
};

type Props = {
  item: PhotoLike;
  ratio?: "video" | "photo" | "square" | "tall" | "cinematic";
  onClick?: (src: string, alt: string) => void;
};

function PhotoCard({ item, ratio = "square", onClick }: Props) {
  const src = item.src ?? item.image ?? "";
  const alt = item.alt ?? item.title ?? "photo";

  const pills = [
    ...(item.tags ?? []),
    ...(item.keywords ?? []),
    ...(item.stack ?? []),
    ...(item.location ? [item.location] : []),
  ];

  const aspect = useMemo(() => {
    switch (ratio) {
      case "video":
        return "aspect-[16/9]";
      case "photo":
        return "aspect-[4/3]";
      case "tall":
        return "aspect-[3/4]";
      case "cinematic":
        return "aspect-[21/9]";
      case "square":
      default:
        return "aspect-[1/1]";
    }
  }, [ratio]);

  if (!src) return null;

  const Base = onClick ? "button" : ("div" as const);
  const baseProps = onClick
    ? { type: "button" as const, onClick: () => onClick?.(src, alt) }
    : {};

  return (
    <CursorTilt className="h-full">
      <Base
        {...baseProps}
        aria-label={alt}
        title={alt}
        className={`group relative block h-full w-full overflow-hidden rounded-2xl bg-card card-hover ${aspect} card-focusable`}
      >
        {/* Image */}
        <div className="absolute inset-0">
          <ShimmerImage
            src={src}
            alt={alt}
            width={1600}
            height={1066}
            sizes="(min-width:1280px) 420px, (min-width:768px) 33vw, 100vw"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
          />
        </div>

        {/* glossy sweep */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute -left-52 top-0 h-full w-40 rotate-12 bg-gradient-to-r from-white/0 via-white/10 to-white/0 blur-sm" />
        </div>

        {/* bottom gradient for legibility */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 sm:h-32 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* pills (tags / location) */}
        {pills.length > 0 && (
          <div className="absolute inset-x-0 bottom-0 pb-2 pt-6 sm:pb-2 sm:pt-8">
            <div className="pointer-events-auto mx-2 flex flex-wrap gap-2">
              {pills.map((t, i) => (
                <span
                  key={`${t}-${i}`}
                  className="inline-flex min-w-[96px] items-center justify-center rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[11px] leading-none text-white/90 backdrop-blur-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </Base>
    </CursorTilt>
  );
}

export default memo(PhotoCard);
