"use client";

import React from "react";
import { LazyMotion, domAnimation, MotionConfig, m, useReducedMotion } from "framer-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig
        transition={{ duration: prefersReduced ? 0 : 0.18, ease: [0.2, 0, 0, 1] }}
        reducedMotion="user"
      >
        <m.div initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          {children}
        </m.div>
      </MotionConfig>
    </LazyMotion>
  );
}
