"use client";

import React, { useState } from "react";
import Image, { type ImageProps } from "next/image";

type Props = Omit<ImageProps, "alt"> & { alt: string; className?: string };

export default function ShimmerImage({ alt, className = "", ...rest }: Props) {
  const [loaded, setLoaded] = useState(false);

  const imgClass = `${className} ${loaded ? "" : "opacity-0"}`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        {...rest}
        alt={alt}
        className={imgClass}
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
