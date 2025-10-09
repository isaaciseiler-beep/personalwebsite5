"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";

const NAME = "isaac seiler";

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -12]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.985]);

  return (
    <section className="relative isolate">
      <motion.div style={{ y, scale }} className="mx-auto max-w-5xl px-4 pt-20 pb-10 sm:pt-28 sm:pb-14">
        <h1
          className="hero-name select-none text-[12vw] leading-[0.9] tracking-tight sm:text-[8rem]"
          aria-label={NAME}
        >
          <AnimatedName text={NAME} />
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-base text-[color:var(--color-fg)]/80">
          Portfolio, experiments, and work notes at the edge of AI, product, and communications.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/experience" className="pressable text-reactive rounded-xl border border-white/10 px-4 py-2 text-sm">
            Experience
          </Link>
          <Link href="/work/projects" className="pressable text-reactive rounded-xl border border-white/10 px-4 py-2 text-sm">
            Projects
          </Link>
          <Link href="/about" className="pressable text-reactive rounded-xl border border-white/10 px-4 py-2 text-sm">
            About
          </Link>
          <a href="mailto:isaac.seiler@outlook.com" className="pressable text-reactive rounded-xl border border-white/10 px-4 py-2 text-sm">
            Contact
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function AnimatedName({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setPos({ x, y });
  };
  const onLeave = () => setPos({ x: 0.5, y: 0.5 });

  const gradient = `radial-gradient(circle at ${pos.x * 100}% ${pos.y * 100}%, white 0%, #999 60%, black 100%)`;

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-block cursor-default relative"
      style={{
        backgroundImage: gradient,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        filter: "contrast(1.1) brightness(1.1)",
        transition: "background-position 0.2s ease",
      }}
    >
      {text}
      {/* soft blur glow */}
      <span
        aria-hidden
        className="absolute inset-0 blur-[6px] opacity-30"
        style={{
          backgroundImage: gradient,
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        {text}
      </span>
    </motion.span>
  );
}
