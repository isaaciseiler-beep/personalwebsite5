// components/Reveal.tsx — FULL FILE
"use client";

import { m, useReducedMotion } from "framer-motion";
import React from "react";

type Props = { children: React.ReactNode; delay?: number; y?: number };

export default function Reveal({ children, delay = 0, y = 10 }: Props) {
  const prefersReduced = useReducedMotion();
  const variants = prefersReduced
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 } };

  return (
    <m.div
      variants={variants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ delay }}
    >
      {children}
    </m.div>
  );
}
