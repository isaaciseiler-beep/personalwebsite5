"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ShimmerImage from "@/components/ShimmerImage";

type PinnedAboutProps = {
  lines: string[];
  imageName: string;
  imageBaseUrl?: string;
  status?: "available" | "busy";
  /** When true, renders only the card (no section, no container, no extra spacing). */
  compact?: boolean;
};

export default function PinnedAbout({
  lines,
  imageName,
  imageBaseUrl,
  status = "available",
  compact = false,
}: PinnedAboutProps) {
  const prefersReduce = useReducedMotion();
  const base =
    imageBaseUrl ??
    process.env.NEXT_PUBLIC_CDN_BASE ??
    "https://pub-41d52824b0bb4f44898c39e1c3c63cb8.r2.dev";
  const src = `${base.replace(/\/$/, "")}/${imageName.replace(/^\//, "")}`;

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
    const pick = (arr: string[]) => arr[Math.floor(Math.abs(Math.sin(seed + arr.length)) * arr.length) % arr.length];
    setHeadline(`${pick(pool[0])} ${pick(pool[1])} ${pick(pool[2])}.`);
  }, [seed, pool]);

  useEffect(() => {
    if (prefersReduce) return;
    const id = setInterval(() => setSeed(s => s + 1), 6000);
    return () => clearInterval(id);
  }, [prefersReduce]);

  const Card = (
    <div
      className="
        grid grid-cols-1 md:grid-cols-3
        rounded-2xl border border-subtle bg-card
        shadow-[0_1px_0_0_hsla(0,0%,100%,0.04)_inset,0_0_0_1px_hsla(0,0%,0%,0.4)_inset]
        overflow-hidden md:h-[300px]
      "
    >
      {/* Left: copy */}
      <div className="relative col-span-2 p-6 md:p-7">
        <div className="absolute right-3 top-3 hidden md:flex items-center gap-2 rounded-full border border-subtle bg-[rgba(255,255,255,0.03)] px-3 py-1 text-xs text-muted">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              status === "available" ? "bg-[color:var(--color-accent)]" : "bg-zinc-500"
            }`}
          />
          {status === "available" ? "open to collabs" : "heads-down"}
        </div>

        <h2 className="mb-2 text-xl">about</h2>

        <motion.p
          key={headline}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReduce ? 0 : 0.35 }}
          className="text-balance text-2xl md:text-3xl leading-snug"
        >
          {headline}
        </motion.p>

        <div className="mt-2 space-y-1.5">
          {lines.slice(1).map((l, i) => (
            <p key={i} className="text-muted">{l}</p>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {["visual explainers", "field notes", "taipei"].map(tag => (
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
            onClick={() => setSeed(s => s + 1)}
            className="text-sm text-muted hover:text-[color:var(--color-accent)]"
            aria-label="shuffle headline"
          >
            shuffle ↻
          </button>
        </div>
      </div>

      {/* Right: single image */}
      <div className="relative">
        <div className="absolute left-0 top-0 h-full w-px bg-[hsla(0,0%,100%,0.06)]" />
        <div className="absolute inset-0">
          <motion.div
            className="h-full w-full"
            whileHover={prefersReduce ? {} : { scale: 1.02 }}
            transition={{ duration: 0.5 }}
          >
            <ShimmerImage
              src={src}
              alt="about"
              width={1200}
              height={1600}
              priority
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>
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
