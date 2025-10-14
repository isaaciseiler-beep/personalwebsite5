// components/Hero.tsx — FINAL refined hero
"use client";

import { motion, useScroll, useTransform, cubicBezier } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NAME = "isaac seiler";
const ease = cubicBezier(0.2, 0, 0, 1);

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -14]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.985]);

  const [reduceMotion, setRM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setRM(mq.matches);
    const l = (e: MediaQueryListEvent) => setRM(e.matches);
    mq.addEventListener?.("change", l);
    return () => mq.removeEventListener?.("change", l);
  }, []);

  return (
    <section id="hero" className="relative isolate overflow-hidden">
      {/* immersive gradient background */}
      <div aria-hidden className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 100% at -20% 0%, rgba(14,18,33,1) 0%, rgba(10,12,25,0.95) 45%, rgba(6,8,15,0.8) 70%, rgba(2,4,8,0.6) 100%)",
          }}
        />
        {/* vignette + grain */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(100% 140% at 70% 120%, rgba(255,255,255,0.04) 0%, transparent 80%)",
            mixBlendMode: "overlay",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'>\
<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter>\
<rect width='160' height='160' filter='url(%23n)' opacity='0.02'/></svg>\")",
          }}
        />
      </div>

      {/* parallax content */}
      <motion.div
        style={reduceMotion ? undefined : { y, scale }}
        className="relative mx-auto max-w-5xl px-4 pt-24 pb-20 sm:pt-32 sm:pb-24"
      >
        <div className="max-w-3xl">
          {/* name */}
          <h1
            className="select-none text-[clamp(3.8rem,9vw,8rem)] leading-[0.88] tracking-tight"
            aria-label={NAME}
          >
            <AnimatedName text={NAME} />
          </h1>

          {/* subtitle */}
          <p className="mt-6 text-lg text-[color:var(--color-fg)]/80 max-w-[36ch]">
            Portfolio, experiments, and work notes at the edge of AI, product, and communications.
          </p>

          {/* buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <CTA href="/experience" label="Experience" />
            <CTA href="/work/projects" label="Projects" />
            <CTA href="/about" label="About" />
            <CTA href="mailto:isaac.seiler@outlook.com" label="Contact" external />
          </div>
        </div>

        {/* subtle inner light border */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[2rem]"
          style={{
            boxShadow:
              "inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 40px rgba(255,255,255,0.04)",
          }}
        />
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

  const base = "rgba(229,233,242,0.24)";
  const gradient = `radial-gradient(circle at ${pos.x * 100}% ${pos.y * 100}%, rgba(255,255,255,0.96) 8%, rgba(189,197,216,0.6) 25%, rgba(50,58,76,0.12) 90%)`;

  return (
    <motion.span
      ref={ref}
      onMouseMove={(e) => {
        setHover(true);
        onMove(e);
      }}
      onMouseLeave={() => setHover(false)}
      className="inline-block relative cursor-default"
      style={{
        color: hover ? "transparent" : base,
        backgroundImage: hover ? gradient : "none",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextStroke: "0.6px rgba(255,255,255,0.16)",
        transition: "background-image 0.35s cubic-bezier(.2,0,0,1), color 0.25s cubic-bezier(.2,0,0,1)",
      }}
    >
      {text}
      {hover && (
        <motion.span
          aria-hidden
          className="absolute inset-0 blur-[8px] opacity-25"
          style={{
            backgroundImage: gradient,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
          transition={{ duration: 0.35, ease }}
        >
          {text}
        </motion.span>
      )}
    </motion.span>
  );
}

function CTA({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const base =
    "pressable rounded-xl border border-white/10 px-4 py-2 text-sm transition-transform duration-150 ease-[cubic-bezier(.2,0,0,1)]";
  const normal: React.CSSProperties = {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
    color: "rgba(245,247,250,0.88)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 6px rgba(0,0,0,0.25)",
  };
  const hover: React.CSSProperties = {
    transform: "translateY(-1px)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 22px rgba(0,0,0,0.38)",
  };

  if (external)
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={base}
        style={normal}
        onMouseEnter={(e) => Object.assign((e.currentTarget as HTMLAnchorElement).style, hover)}
        onMouseLeave={(e) =>
          Object.assign((e.currentTarget as HTMLAnchorElement).style, normal)
        }
      >
        {label}
      </a>
    );

  return (
    <Link
      href={href}
      prefetch
      className={base}
      style={normal}
      onMouseEnter={(e) => Object.assign((e.currentTarget as HTMLAnchorElement).style, hover)}
      onMouseLeave={(e) =>
        Object.assign((e.currentTarget as HTMLAnchorElement).style, normal)
      }
    >
      {label}
    </Link>
  );
}
