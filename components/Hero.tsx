"use client";

import { m, useReducedMotion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  const prefers = useReducedMotion();
  return (
    <section className="hero-bg overflow-hidden rounded-2xl border border-subtle p-8 md:p-12 relative">
      <m.div
        initial={prefers ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: [0.2,0,0,1] }}
      >
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">isaac seiler</h1>
        <p className="mt-4 max-w-xl text-muted">
          building at the edge of ai, policy, and visual storytelling. projects, photos, research.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/about" prefetch className="rounded-xl border border-subtle px-4 py-2 hover:border-accent/60">about</Link>
          <Link href="/work" prefetch className="rounded-xl border border-subtle px-4 py-2 hover:border-accent/60">my work</Link>
        </div>
      </m.div>
    </section>
  );
}
