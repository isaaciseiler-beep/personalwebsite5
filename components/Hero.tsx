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
          className="select-none text-[12vw] leading-[0.9] tracking-tight sm:text-[8rem]"
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
  const ref = useRef<HTMLSpanElement>(null);
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const onLeave = () => setHover(false);

  // soft radial lighting gradient only when hovering
  const base = "black";
  const gradient = hover
    ? `radial-gradient(circle at ${pos.x * 100}% ${pos.y * 100}%, white 10%, #ccc 30%, ${base} 100%)`
    : base;

  return (
    <motion.span
      ref={ref}
      onMouseMove={(e) => {
        setHover(true);
        onMove(e);
      }}
      onMouseLeave={onLeave}
      className="inline-block relative cursor-default"
      style={{
        color: hover ? "transparent" : base,
        backgroundImage: gradient,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        transition: "background 0.4s ease, color 0.4s ease",
      }}
    >
      {text}
      {hover && (
        <motion.span
          aria-hidden
          className="absolute inset-0 blur-[8px] opacity-30"
          style={{
            backgroundImage: gradient,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
          transition={{ duration: 0.3 }}
        >
          {text}
        </motion.span>
      )}
    </motion.span>
  );
}
