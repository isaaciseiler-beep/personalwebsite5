// components/Hero.tsx — FULL REPLACEMENT (premium, left-aligned, luminous + subtle parallax)
"use client";

import { motion, useScroll, useTransform, cubicBezier } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const NAME = "isaac seiler";
const ease = cubicBezier(0.2, 0, 0, 1);

export default function Hero() {
  // micro-parallax
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 320], [0, -14]);
  const scale = useTransform(scrollY, [0, 320], [1, 0.985]);

  // reduced-motion
  const prefersReduced = usePrefersReducedMotion();

  return (
    <section id="hero" className="relative isolate overflow-hidden">
      {/* Ambient scene */}
      <BackgroundScene />

      {/* Composition */}
      <motion.div
        style={prefersReduced ? undefined : { y, scale }}
        className="relative mx-auto max-w-5xl px-4 pt-24 pb-20 sm:pt-32 sm:pb-28"
      >
        {/* Luminous frame (subtle glass bevel + gradient ring) */}
        <div className="relative rounded-[28px]">
          {/* gradient ring */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[28px]"
            style={{
              padding: 1,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
          {/* inner glass */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[28px]"
            style={{
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 22px 60px rgba(255,255,255,0.04), inset 0 -30px 80px rgba(0,0,0,0.45)",
              background:
                "radial-gradient(120% 140% at 0% 0%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 38%, rgba(0,0,0,0) 60%)",
            }}
          />

          {/* Content block */}
          <div className="relative z-10 max-w-[48rem]">
            <h1
              className="select-none text-[clamp(3.8rem,9vw,8.2rem)] leading-[0.86] tracking-tight"
              aria-label={NAME}
            >
              <AnimatedName text={NAME} />
            </h1>

            <p className="mt-6 text-lg text-[color:var(--color-fg)]/82 max-w-[42ch]">
              Portfolio, experiments, and work notes at the edge of AI, product, and communications.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <CTA href="/experience" label="Experience" />
              <CTA href="/work/projects" label="Projects" />
              <CTA href="/about" label="About" />
              <CTA href="mailto:isaac.seiler@outlook.com" label="Contact" external />
            </div>
          </div>

          {/* specular glints */}
          <SpecularGlints />
        </div>
      </motion.div>
    </section>
  );
}

/* ---------- Layers ---------- */

function BackgroundScene() {
  // precompute SVG noise URL once
  const noise = useMemo(
    () =>
      "url(\"data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'>\
<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter>\
<rect width='160' height='160' filter='url(%23n)' opacity='0.022'/></svg>\")",
    []
  );

  return (
    <div aria-hidden className="absolute inset-0">
      {/* deep navy field with directional falloff */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(140% 110% at -20% -10%, rgba(14,18,33,1) 0%, rgba(8,11,22,0.96) 40%, rgba(5,8,16,0.86) 65%, rgba(2,4,8,0.72) 100%)",
        }}
      />
      {/* aurora tuck (top-left) */}
      <div
        className="absolute -top-24 -left-24 h-[48rem] w-[48rem] rounded-full blur-[80px] opacity-[.20]"
        style={{
          background:
            "conic-gradient(from 210deg at 50% 50%, rgba(110,140,255,0.35), rgba(192,220,255,0.18), rgba(80,100,190,0.32), rgba(110,140,255,0.35))",
          mixBlendMode: "screen",
        }}
      />
      {/* soft vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(100% 140% at 80% 120%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.0) 55%)",
        }}
      />
      {/* grain */}
      <div className="absolute inset-0" style={{ backgroundImage: noise, mixBlendMode: "overlay" }} />
      {/* top fade for header harmony */}
      <div
        className="absolute inset-x-0 top-0 h-24"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.28), rgba(0,0,0,0))" }}
      />
    </div>
  );
}

function SpecularGlints() {
  return (
    <>
      {/* top chamfer sweep */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-[2px] opacity-70"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
          filter: "blur(.4px)",
        }}
      />
      {/* corner wells */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-6 top-6 h-24 w-24 rounded-full"
        style={{
          background: "radial-gradient(60% 60% at 30% 30%, rgba(255,255,255,0.06), transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-6 bottom-6 h-24 w-24 rounded-full"
        style={{
          background: "radial-gradient(60% 60% at 70% 70%, rgba(255,255,255,0.05), transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
    </>
  );
}

/* ---------- Interactions ---------- */

function AnimatedName({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  };

  const idleFill = "rgba(226,232,240,0.20)"; // soft silver
  const stroke = hover ? "0.6px rgba(255,255,255,0.28)" : "0.6px rgba(255,255,255,0.12)";
  const grad = `radial-gradient(circle at ${pos.x * 100}% ${pos.y * 100}%, rgba(255,255,255,0.98) 9%, rgba(208,216,235,0.58) 26%, rgba(52,62,88,0.10) 92%)`;

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
        color: hover ? "transparent" : idleFill,
        WebkitTextStroke: stroke,
        backgroundImage: hover ? grad : "none",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        transition:
          "background-image .35s cubic-bezier(.2,0,0,1), color .25s cubic-bezier(.2,0,0,1), -webkit-text-stroke-color .25s cubic-bezier(.2,0,0,1)",
      }}
    >
      {text}
      {hover && (
        <motion.span
          aria-hidden
          className="absolute inset-0 blur-[10px] opacity-24"
          style={{ backgroundImage: grad, backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}
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
    "rounded-xl border border-white/10 px-4 py-2 text-sm transition-transform duration-150 ease-[cubic-bezier(.2,0,0,1)]";
  const normal: React.CSSProperties = {
    background: "linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.02) 100%)",
    color: "rgba(245,247,250,0.9)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.26)",
  };
  const hover: React.CSSProperties = {
    transform: "translateY(-1px)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 28px rgba(0,0,0,0.38)",
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
        onMouseLeave={(e) => Object.assign((e.currentTarget as HTMLAnchorElement).style, normal)}
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
      onMouseLeave={(e) => Object.assign((e.currentTarget as HTMLAnchorElement).style, normal)}
    >
      {label}
    </Link>
  );
}

/* ---------- hooks ---------- */

function usePrefersReducedMotion() {
  const [v, setV] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setV(mq.matches);
    const l = (e: MediaQueryListEvent) => setV(e.matches);
    mq.addEventListener?.("change", l);
    return () => mq.removeEventListener?.("change", l);
  }, []);
  return v;
}
