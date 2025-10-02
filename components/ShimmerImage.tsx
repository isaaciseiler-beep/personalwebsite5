"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * Enforces `alt` and preserves all Next/Image props.
 * Adds a lightweight shimmer placeholder until the image has loaded.
 */
type Props = Omit<ImageProps, "alt"> & { alt: string; className?: string };

export default function ShimmerImage({ alt, className = "", ...rest }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        {...rest}
        alt={alt}
        className={`${className} ${loaded ? "" : "opacity-0"}`}
        onLoadingComplete={() => setLoaded(true)}
      />
      {!loaded && (
        <div
          className="absolute inset-0 animate-pulse bg-[linear-gradient(90deg,rgba(255,255,255,.04),rgba(255,255,255,.08),rgba(255,255,255,.04))] bg-[length:200%_100%]"
          aria-hidden
        />
      )}
    </div>
  );
}
