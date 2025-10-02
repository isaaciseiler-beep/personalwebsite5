"use client";

import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import ScrollCue from "@/components/ScrollCue";

export default function Hero() {
  const prefers = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const ty = useTransform(scrollYProgress, [0, 1], [0, prefers ? 0 : -12]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden">
      <div className="hero-bg absolute inset-0" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 md:py-28">
        <m.div style={{ y: ty }}>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">isaac seiler</h1>
          <p className="mt-4 max-w-xl text-muted">
            building at the edge of ai, policy, and visual storytelling. projects, photos, research.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/about" prefetch className="rounded-xl border border-subtle px-4 py-2 hover:border-[color:var(--color-accent)]/60">
              about
            </Link>
            <Link href="/work" prefetch className="rounded-xl border border-subtle px-4 py-2 hover:border-[color:var(--color-accent)]/60">
              my work
            </Link>
          </div>
          <ScrollCue />
        </m.div>
      </div>
    </section>
  );
}
