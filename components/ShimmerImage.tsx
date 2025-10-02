"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * ShimmerImage wraps next/image with a lightweight shimmer placeholder.
 * It enforces `alt` text so accessibility and ESLint rules are satisfied.
 */
type Props = Omit<ImageProps, "alt"> & { alt: string; className?: string };

export default function ShimmerImage({ alt, className = "", ...rest }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        {...rest}
        alt={alt}                          {/* 👈 always enforced */}
        className={`${className} ${loaded ? "" : "opacity-0"}`}
        onLoadingComplete={() => setLoaded(true)}
      />
      {!loaded && (
        <div
          aria-hidden
          className="absolute inset-0 animate-pulse bg-[linear-gradient(90deg,rgba(255,255,255,.04),rgba(255,255,255,.08),rgba(255,255,255,.04))] bg-[length:200%_100%]"
        />
      )}
    </div>
  );
}
