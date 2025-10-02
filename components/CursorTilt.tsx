// components/CursorTilt.tsx — FULL FILE
"use client";

import React, { useRef } from "react";
import { useReducedMotion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  maxTiltDeg?: number;  // default 6
  scale?: number;       // default 1.015
  className?: string;
};

export default function CursorTilt({ children, maxTiltDeg = 6, scale = 1.015, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  function reset() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translateZ(0)";
  }

  function onMove(e: React.MouseEvent) {
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * (maxTiltDeg * 2);
    const ry = (px - 0.5) * (maxTiltDeg * 2);
    el.style.transform = `perspective(800px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${scale})`;
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ transition: "transform 150ms cubic-bezier(0.2,0,0,1)", willChange: "transform" }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onBlur={reset}
    >
      {children}
    </div>
  );
}
