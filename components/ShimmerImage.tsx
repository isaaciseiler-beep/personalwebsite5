"use client";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

export default function ShimmerImage(props: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative overflow-hidden ${props.className ?? ""}`}>
      <Image {...props} className={`${props.className ?? ""} ${loaded ? "" : "opacity-0"}`} onLoadingComplete={() => setLoaded(true)} />
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-[linear-gradient(90deg,rgba(255,255,255,.04),rgba(255,255,255,.08),rgba(255,255,255,.04))] bg-[length:200%_100%]" />
      )}
    </div>
  );
}
