// components/Hero.tsx — FULL REPLACEMENT (theme-aware wordmark images)
"use client";

import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ScrollCue from "@/components/ScrollCue";

function useTheme(): "dark" | "light" {
  const [t, setT] = useState<"dark" | "light">(
    (typeof document !== "undefined" &&
      (document.documentElement.getAttribute("data-theme") as "dark" | "light")) || "dark"
  );
  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => {
      setT(el.getAttribute("data-theme") === "light" ? "light" : "dark");
    });
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return t;
}

export default function Hero() {
  const prefers = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const ty = useTransform(scrollYProgress, [0, 1], [0, prefers ? 0 : -12]);

  const theme = useTheme();
  const src = theme === "light" ? "/isaacseiler-lightmode.png" : "/isaacseiler-darkmode.png";

  return (
    <section ref={ref} className="relative isolate overflow-hidden">
      <div className="hero-bg absolute inset-0" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 md:py-28">
        <m.div style={{ y: ty }}>
          {/* theme-aware wordmark */}
          <div className="w-full">
            <Image
              src={src}
              alt="Isaac Seiler"
              priority
              width={1600}
              height={600}
              sizes="(min-width: 1024px) 900px, (min-width: 768px) 720px, 90vw"
              className="h-auto w-full max-w-[900px]"
            />
          </div>

          <p className="mt-6 max-w-xl text-muted">
            building at the edge of ai, policy, and visual storytelling. projects, photos, research.
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

          <ScrollCue />
        </m.div>
      </div>
    </section>
  );
}
