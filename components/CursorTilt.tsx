// components/CursorTilt.tsx — FULL REPLACEMENT
"use client";

import React from "react";
import CardMotion from "@/components/CardMotion";

type Props = {
  children: React.ReactNode;
  maxTiltDeg?: number;
  scale?: number;
  className?: string;
};

export default function CursorTilt({
  children,
  maxTiltDeg = 6,
  scale = 1.015,
  className,
}: Props) {
  return (
    <CardMotion maxTiltDeg={maxTiltDeg} scale={scale} className={className}>
      {children}
    </CardMotion>
  );
}
