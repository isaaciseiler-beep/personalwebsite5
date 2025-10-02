"use client";

import { m, useReducedMotion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  const prefers = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden">
      {/* full-bleed animated gradient background */}
      <div className="hero-bg absolute inset-0" aria-hidden="true" />

      {/* bottom fade so gradient ends before next section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, var(--color-bg) 80%)",
        }}
        aria-hidden="true"
      />

      {/* content container */}
      <div className="mx-auto max-w-5xl px-4 py-20 md:py-28">
        <m.div
          initial={prefers ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
        >
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            isaac seiler
          </h1>
          <p className="mt-4 max-w-xl text-muted">
            building at the edge of ai, policy, and visual storytelling.
            projects, photos, research.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/about"
              prefetch
              className="rounded-xl border border-subtle px-4 py-2 hover:border-[color:var(--color-accent)]/60"
            >
              about
            </Link>
            <Link
              href="/work"
              prefetch
              className="rounded-xl border border-subtle px-4 py-2 hover:border-[color:var(--color-accent)]/60"
            >
              my work
            </Link>
          </div>
        </m.div>
      </div>
    </section>
  );
}
