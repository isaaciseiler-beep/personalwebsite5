// components/PinnedAbout.tsx — FULL REPLACEMENT
"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ShimmerImage from "@/components/ShimmerImage";

export type PinnedAboutProps = {
  lines: string[];
  imageName: string;
  imageBaseUrl?: string;
  imageAlt?: string;
  status?: "available" | "busy";
  /** When true, renders only the card (no section wrapper). */
  compact?: boolean;
};

export default function PinnedAbout({
  lines,
  imageName,
  imageBaseUrl,
  imageAlt = "about",
  status = "available",
  compact = false,
}: PinnedAboutProps) {
  const prefersReduce = useReducedMotion();

  // Build absolute image URL safely
  const base =
    imageBaseUrl ??
    process.env.NEXT_PUBLIC_CDN_BASE ??
    "https://pub-41d52824b0bb4f44898c39e1c3c63cb8.r2.dev";
  const src = `${base.replace(/\/$/, "")}/${imageName.replace(/^\//, "")}`;

  // Headline ticker
  const pool = useMemo(
    () => [
      ["designerly research", "field-tested visuals", "civic data work"],
      ["at the edge of", "across", "between"],
      ["ai", "policy", "public sector"],
    ],
    []
  );
  const [seed, setSeed] = useState(0);
  const [headline, setHeadline] = useState("");

  useEffect(() => {
    const pick = (arr: string[]) =>
      arr[Math.floor(Math.abs(Math.sin(seed + arr.length)) * arr.length) % arr.length];
    setHeadline(`${pick(pool[0])} ${pick(pool[1])} ${pick(pool[2])}.`);
  }, [seed, pool]);

  useEffect(() => {
    if (prefersReduce) return;
    const id = setInterval(() => setSeed((s) => s + 1), 6000);
    return () => clearInterval(id);
  }, [prefersReduce]);

  const Card = (
    <div
      className="
        grid grid-cols-1 md:grid-cols-3
        overflow-hidden rounded-2xl border border-subtle bg-card
        shadow-[0_1px_0_0_hsla(0,0%,100%,0.04)_inset,0_0_0_1px_hsla(0,0%,0%,0.4)_inset]
        md:h-[300px]
      "
    >
      {/* Left: copy */}
      <div className="relative col-span-2 p-6 md:p-7">
        {/* Status pill */}
        <div
          className="absolute right-3 top-3 hidden items-center gap-2 rounded-full border border-subtle bg-[rgba(255,255,255,0.03)] px-3 py-1 text-xs text-muted md:flex"
          aria-live="polite"
        >
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              status === "available" ? "bg-[color:var(--color-accent)]" : "bg-zinc-500"
            }`}
            aria-hidden="true"
          />
          <span>{status === "available" ? "open to collabs" : "heads-down"}</span>
        </div>

        <h2 className="mb-2 text-xl">about</h2>

        <motion.p
          key={headline}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReduce ? 0 : 0.35 }}
          className="text-balance text-2xl leading-snug md:text-3xl"
        >
          {headline}
        </motion.p>

        <div className="mt-2 space-y-1.5">
          {lines.slice(1).map((l, i) => (
            <p key={i} className="text-muted">
              {l}
            </p>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {["visual explainers", "field notes", "taipei"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-subtle bg-[rgba(255,255,255,0.02)] px-3 py-1 text-xs text-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex gap-3">
          <SmartLink href="/about" label="about me" />
          <SmartLink href="/contact" label="collab" />
          <button
            onClick={() => setSeed((s) => s + 1)}
            className="text-sm text-muted hover:text-[color:var(--color-accent)]"
            aria-label="shuffle headline"
          >
            shuffle ↻
          </button>
        </div>
      </div>

      {/* Right: image fills exact right 33% */}
      <div className="relative md:col-span-1">
        {/* hard divider line; no gradient */}
        <div className="absolute left-0 top-0 h-full w-px bg-[hsla(0,0%,100%,0.06)]" aria-hidden="true" />
        <motion.div
          className="relative h-[260px] w-full md:h-full"
          whileHover={prefersReduce ? {} : { scale: 1.02 }}
          transition={{ duration: 0.5 }}
        >
          {/* Image is pinned edge-to-edge and inherits card rounding via overflow-hidden */}
          <ShimmerImage
            src={src}
            alt={imageAlt}
            width={1200}
            height={1600}
            priority
            className="absolute inset-0 h-full w-full object-cover"
          />
        </motion.div>
      </div>
    </div>
  );

  if (compact) return Card;

  return (
    <section className="py-0">
      <div className="mx-auto max-w-5xl px-4">{Card}</div>
    </section>
  );
}

function SmartLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      prefetch
      className="inline-flex items-center gap-1 text-sm text-muted hover:text-[color:var(--color-accent)]"
      aria-label={label}
    >
      {label} <span aria-hidden>→</span>
    </Link>
  );
}
