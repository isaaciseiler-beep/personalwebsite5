// components/PhotoCard.tsx — FULL REPLACEMENT
"use client";

import { memo, useMemo } from "react";
import ShimmerImage from "@/components/ShimmerImage";

type PhotoLike = {
  src?: string;
  alt?: string;
  image?: string;
  title?: string;
  tags?: string[];
};

type Props = {
  item: PhotoLike;
  ratio?: "video" | "photo" | "square" | "tall" | "cinematic";
  onClick?: (src: string, alt: string) => void;
};

function PhotoCard({ item, ratio = "photo", onClick }: Props) {
  const src = item.src ?? item.image ?? "";
  const alt = item.alt ?? item.title ?? "photo";

  const aspect = useMemo(() => {
    switch (ratio) {
      case "video": return "aspect-[16/9]";
      case "square": return "aspect-[1/1]";
      case "tall": return "aspect-[3/4]";
      case "cinematic": return "aspect-[21/9]";
      case "photo":
      default: return "aspect-[4/3]";
    }
  }, [ratio]);

  if (!src) return null;

  return (
    <button
      type="button"
      onClick={() => onClick?.(src, alt)}
      className={`group relative block w-full overflow-hidden rounded-2xl border border-subtle bg-card ${aspect}`}
      aria-label={alt}
    >
      {/* Image layer */}
      <div className="absolute inset-0">
        <ShimmerImage
          src={src}
          alt={alt}
          width={1600}
          height={1066}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>

      {/* Header-level gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 sm:h-32 bg-gradient-to-t from-[rgba(0,0,0,0.66)] via-[rgba(0,0,0,0.28)] to-transparent"
        aria-hidden="true"
      />

      {/* Pills bar, flush bottom */}
      {!!item.tags?.length && (
        <div className="absolute inset-x-0 bottom-0 pb-2 pt-6 sm:pb-2 sm:pt-8">
          <div className="pointer-events-auto mx-2 flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <span
                key={t}
                className="inline-flex min-w-[96px] items-center justify-center rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[11px] leading-none text-white/90 backdrop-blur-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </button>
  );
}

export default memo(PhotoCard);
