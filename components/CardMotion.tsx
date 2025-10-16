"use client";

import React, { useRef } from "react";

/**
 * CardMotion
 * Cinematic tilt + reactive glow
 * – fluid easing, no visible hard edge
 * – multi-layer gradient depth + inertial return
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
  maxTiltDeg = 5,
  scale = 1.01,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);
  const velocity = useRef({ x: 0, y: 0 });
  const current = useRef({ rx: 0, ry: 0 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);

      const px = (x / rect.width - 0.5) * 2;
      const py = (y / rect.height - 0.5) * 2;

      // smooth motion physics (inertia interpolation)
      const targetRx = -(py * maxTiltDeg);
      const targetRy = px * maxTiltDeg;
      current.current.rx += (targetRx - current.current.rx) * 0.12;
      current.current.ry += (targetRy - current.current.ry) * 0.12;

      el.style.transform = `perspective(1200px) rotateX(${current.current.rx.toFixed(
        2
      )}deg) rotateY(${current.current.ry.toFixed(2)}deg) scale(${scale})`;
    });
  }

  function reset() {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 900ms cubic-bezier(.16,1,.3,1)";
    el.style.transform = "none";
    requestAnimationFrame(() => (el.style.transition = ""));
  }

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
      className={`group relative overflow-hidden rounded-[inherit] will-change-transform transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${className}`}
      style={{
        ["--mx" as any]: "50%",
        ["--my" as any]: "50%",
      } as React.CSSProperties}
    >
      {/* Layer 1: inner luminous gradient that follows cursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(380px circle at var(--mx) var(--my), rgba(14,165,233,0.10), rgba(14,165,233,0.03) 35%, transparent 70%)",
          filter: "blur(30px)",
          mixBlendMode: "screen",
        }}
      />

      {/* Layer 2: subtle diagonal sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.0) 30%, rgba(255,255,255,0.05) 100%)",
          opacity: 0.7,
          mixBlendMode: "overlay",
        }}
      />

      {/* Layer 3: ambient vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 120%, rgba(0,0,0,0.35), rgba(0,0,0,0.0) 70%)",
          opacity: 0.4,
        }}
      />

      {children}
    </div>
  );
}
