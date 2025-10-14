// components/Hero.tsx — FULL REPLACEMENT (fix typed easing)
"use client";

import { motion, cubicBezier } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const NAME = "isaac seiler";
const ease = cubicBezier(0.2, 0, 0, 1);

export default function Hero() {
  const [reduceMotion, setRM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setRM(mq.matches);
    const l = (e: MediaQueryListEvent) => setRM(e.matches);
    mq.addEventListener?.("change", l);
    return () => mq.removeEventListener?.("change", l);
  }, []);

  const tr = { duration: 0.45, ease };

  return (
    <section id="hero" className="relative isolate" aria-label="intro">
      <div className="mx-auto w-full max-w-6xl px-4" style={{ paddingTop: "min(8vh, 56px)" }}>
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={tr}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,18,36,0.86) 0%, rgba(8,14,28,0.92) 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.06), " +
              "inset 0 -1px 0 rgba(0,0,0,0.35), " +
              "inset 0 22px 60px rgba(255,255,255,0.04), " +
              "inset 0 -28px 60px rgba(0,0,0,0.35), " +
              "0 22px 60px rgba(0,0,0,0.32)",
            border: "1px solid rgba(255,255,255,0.05)",
            minHeight: "min(72vh, 760px)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 55%), radial-gradient(100% 100% at 50% 100%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 50%)",
              mixBlendMode: "overlay",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'>\
<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter>\
<rect width='160' height='160' filter='url(%23n)' opacity='0.03'/></svg>\")",
            }}
          />

          <motion.div
            aria-hidden
            initial={reduceMotion ? undefined : { opacity: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            transition={{ ...tr, delay: 0.15 }}
            className="absolute inset-x-0 -top-px h-1"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
              filter: "blur(0.5px)",
              opacity: 0.7,
            }}
          />

          <div className="relative z-10 flex min-h-[56vh] flex-col items-center justify-center px-6 py-12 sm:py-16">
            <motion.h1
              initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ ...tr, delay: 0.05 }}
              aria-label={NAME}
              className="select-none text-center font-extrabold leading-[0.92] tracking-tight"
              style={{
                fontSize: "clamp(2.8rem, 9vw, 6.8rem)",
                color: "rgba(229,233,242,0.82)",
                textShadow: "0 1px 0 rgba(0,0,0,0.35), 0 14px 40px rgba(0,0,0,0.35)",
              }}
            >
              {NAME}
            </motion.h1>

            <motion.p
              initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ ...tr, delay: 0.15 }}
              className="mt-5 max-w-2xl text-center text-base sm:text-lg"
              style={{ color: "rgba(225,229,238,0.78)" }}
            >
              Portfolio, experiments, and work notes at the edge of AI, product, and communications.
            </motion.p>

            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ ...tr, delay: 0.25 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <CTA href="/experience" label="Experience" />
              <CTA href="/work/projects" label="Projects" />
              <CTA href="/about" label="About" />
              <CTA href="mailto:isaac.seiler@outlook.com" label="Contact" external />
            </motion.div>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-4 rounded-2xl"
            style={{
              boxShadow:
                "inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 18px 50px rgba(255,255,255,0.03), inset 0 -18px 60px rgba(0,0,0,0.35)",
            }}
          />
        </motion.div>
      </div>
    </section>
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
    "rounded-xl border border-white/10 px-4 py-2 text-sm leading-none transition-transform will-change-transform";
  const style: React.CSSProperties = {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.02) 100%)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 6px 18px rgba(0,0,0,0.25)",
    color: "rgba(235,239,248,0.92)",
  };
  const hover: React.CSSProperties = {
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 28px rgba(0,0,0,0.34)",
    transform: "translateY(-1px)",
  };

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={base + " pressable text-reactive"}
        style={style}
        onMouseEnter={(e) => Object.assign((e.currentTarget as HTMLAnchorElement).style, hover)}
        onMouseLeave={(e) =>
          Object.assign((e.currentTarget as HTMLAnchorElement).style, style)
        }
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      href={href}
      prefetch
      className={base + " pressable text-reactive"}
      style={style}
      onMouseEnter={(e) => Object.assign((e.currentTarget as HTMLAnchorElement).style, hover)}
      onMouseLeave={(e) =>
        Object.assign((e.currentTarget as HTMLAnchorElement).style, style)
      }
    >
      {label}
    </Link>
  );
}
