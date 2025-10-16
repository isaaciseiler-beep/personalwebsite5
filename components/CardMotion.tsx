"use client";

import React, { useRef } from "react";

/**
 * CardMotion
 * Subtle, cinematic hover response:
 *  – micro-tilt (3°)
 *  – soft ambient glow (barely visible)
 *  – seamless transitions / corner-safe mask
 */
type Props = {
  children: React.ReactNode;
  className?: string;
  maxTiltDeg?: number;
  scale?: number;
};

export default function CardMotion({
  children,
  className = "",
  maxTiltDeg = 3,
  scale = 1.006,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);

      const px = (x / rect.width) * 2 - 1;
      const py = (y / rect.height) * 2 - 1;
      const rx = -(py * maxTiltDeg);
      const ry = px * maxTiltDeg;
      el.style.transform = `perspective(1200px) rotateX(${rx.toFixed(
        2
      )}deg) rotateY(${ry.toFixed(2)}deg) scale(${scale})`;
    });
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "none";
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onTouchStart={() => {
        const el = ref.current;
        if (el) el.style.transform = `scale(${scale})`;
      }}
      onTouchEnd={reset}
      className={`group relative overflow-hidden rounded-[inherit] will-change-transform transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${className}`}
      style={{
        ["--mx" as any]: "50%",
        ["--my" as any]: "50%",
      } as React.CSSProperties}
    >
      {/* ultra-soft spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(320px circle at var(--mx) var(--my), rgba(14,165,233,0.06), rgba(14,165,233,0.015) 35%, transparent 70%)",
          maskImage: "radial-gradient(circle at center, #000 75%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(circle at center, #000 75%, transparent 100%)",
          filter: "blur(20px)",
        }}
      />
      {children}
    </div>
  );
}
