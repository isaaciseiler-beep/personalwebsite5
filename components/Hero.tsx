// components/Hero.tsx — FULL FILE REPLACEMENT
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

const NAME = "isaac seiler";

export default function Hero() {
  // subtle parallax and scale on scroll
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -12]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.985]);

  return (
    <section className="relative isolate">
      {/* background flourish: lines that react to pointer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(50%_50%_at_50%_50%,black,transparent)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0_49%,_currentColor_50%,transparent_51%)] opacity-[0.04] bg-[length:4px_100%]" />
      </div>

      <motion.div style={{ y, scale }} className="mx-auto max-w-5xl px-4 pt-20 pb-10 sm:pt-28 sm:pb-14">
        {/* dynamic name */}
        <h1
          className="hero-name select-none text-balance text-[12vw] leading-[0.9] tracking-[-0.02em] sm:text-[8rem]"
          aria-label={NAME}
        >
          <AnimatedName text={NAME} />
        </h1>

        {/* subcopy */}
        <p className="mt-6 max-w-2xl text-pretty text-base text-[color:var(--color-fg)]/80">
          Portfolio, experiments, and work notes at the edge of AI, product, and communications.
        </p>

        {/* actions */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/experience"
            className="pressable text-reactive rounded-xl border border-white/10 px-4 py-2 text-sm"
          >
            Experience
          </Link>
          <Link
            href="/work/projects"
            className="pressable text-reactive rounded-xl border border-white/10 px-4 py-2 text-sm"
          >
            Projects
          </Link>
          <Link
            href="/about"
            className="pressable text-reactive rounded-xl border border-white/10 px-4 py-2 text-sm"
          >
            About
          </Link>
          <a
            href="mailto:isaac.seiler@outlook.com"
            className="pressable text-reactive rounded-xl border border-white/10 px-4 py-2 text-sm"
          >
            Contact
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function AnimatedName({ text }: { text: string }) {
  // Split to letters for subtle stagger. Keeps it performant.
  const letters = Array.from(text);
  return (
    <span className="inline-block will-change-transform">
      {letters.map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          className="hero-letter"
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "tween", duration: 0.45, delay: 0.02 * i }}
          whileHover={{ y: -2 }}
          whileTap={{ y: 1, scale: 0.99 }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
      {/* shimmering stroke overlay */}
      <span aria-hidden className="hero-stroke" />
    </span>
  );
}

