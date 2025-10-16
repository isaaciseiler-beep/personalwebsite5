"use client";

import React, { useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  maxTiltDeg?: number; // default 6
  scale?: number; // default 1.015
};

/**
 * CardMotion = Tilt + mouse-follow spotlight.
 * Zero React state on mousemove (perf). rAF-throttled style writes.
 */
export default function CardMotion({
  children,
  className = "",
  maxTiltDeg = 6,
  scale = 1.015,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  function apply(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left; // local x
    const y = e.clientY - rect.top;  // local y

    // spotlight position via CSS variables (no re-render)
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);

    // tilt
    const px = (x / rect.width) * 2 - 1;  // -1..1
    const py = (y / rect.height) * 2 - 1; // -1..1
    const rx = -(py * maxTiltDeg);
    const ry = px * maxTiltDeg;

    el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(
      2
    )}deg) scale(${scale})`;
  }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => apply(e));
  }

  function onMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "none";
    // park spotlight to center to avoid residual glow on touch devices
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`group relative will-change-transform transition-transform duration-150 ${className}`}
      // sensible defaults so SSR/hydration is stable
      style={{ ["--mx" as any]: "50%", ["--my" as any]: "50%" } as React.CSSProperties}
    >
      {/* spotlight overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        style={{
          // subtle, brand-agnostic glow; adjust radii or stops as needed
          background:
            "radial-gradient(180px 180px at var(--mx) var(--my), rgba(14,165,233,0.22), rgba(14,165,233,0.06) 45%, transparent 65%)",
          maskImage: "linear-gradient(#000, #000)",
        }}
      />
      {/* content */}
      {children}
    </div>
  );
}
