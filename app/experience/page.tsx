"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import Reveal from "@/components/Reveal";
import ExperienceEducation from "@/components/ExperienceEducation";
import { TimelineItem } from "@/components/TimelineItem";
import items from "@/data/timeline.json";
import type { TimelineEvent } from "@/types/timeline";
import ExperienceChatFab from "@/components/ExperienceChatFab";

type Linked = TimelineEvent & {
  href?: string | null;
  link?: string | null;
  image?: string | null;
  linkText?: string | null;       // your original “learn more…” copy
  desc?: string | null;           // brief summary
  description?: string | null;    // alt key
};

export default function ExperiencePage() {
  const events = items as Linked[];

  // Single-year assignment per item
  // - Force "communications director" and "transition aide" to 2023
  // - Else pick MAX year in dates; fallback = current year
  const byYear = useMemo(() => {
    const maxYear = (s?: string) => {
      if (!s) return null;
      const m = s.match(/\b(19|20)\d{2}\b/g);
      if (!m) return null;
      return Math.max(...m.map((v) => parseInt(v, 10)));
    };
    const map = new Map<number, Linked[]>();
    for (const ev of events) {
      const role = (ev.role ?? "").toLowerCase();
      const y =
        role.includes("communications director") || role.includes("transition aide")
          ? 2023
          : maxYear(ev.dates) ?? new Date().getFullYear();
      map.set(y, [...(map.get(y) ?? []), ev]);
    }
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [events]);

  return (
    <PageTransition>
      {/* header */}
      <section className="mx-auto max-w-5xl px-4 pt-12 md:pt-16">
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="text-3xl font-semibold tracking-tight md:text-5xl">
          experience
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="mt-3 max-w-3xl text-sm text-muted md:text-base">
          Roles across media, policy, and applied AI.
        </motion.p>
      </section>

      {/* education (fixed cell) */}
      <section className="mx-auto mt-8 max-w-5xl px-4">
        <h2 className="mb-4 text-xl">education</h2>
        <Reveal>
          <ExperienceEducation />
        </Reveal>
      </section>

      {/* timeline */}
      <section className="mx-auto mt-10 max-w-5xl px-4 pb-16">
        <h2 className="mb-4 text-xl">professional experience</h2>

        <ol className="relative space-y-10">
          {/* spine */}
          <span aria-hidden className="pointer-events-none absolute left-[0.5rem] top-0 h-full w-px bg-[linear-gradient(180deg,rgba(255,255,255,.28),rgba(255,255,255,.06))]" />

          {byYear.map(([year, list], yi) => (
            <li key={year} className="space-y-6">
              {/* sticky year chip — higher offset + translucent backdrop so it never hides under header */}
              <div className="sticky top-[88px] z-30 -mx-4 px-4">
                <div className="flex items-center gap-3 rounded-lg border border-subtle bg-[color:var(--color-bg)]/60 px-2 py-1 backdrop-blur">
                  <span className="text-xs text-muted">{year}</span>
                  <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(255,255,255,.18),transparent)]" />
                </div>
              </div>

              <div className="relative border-l border-subtle pl-6">
                <div className="space-y-6">
                  {list.map((ev, i) => {
                    const href = ev.href ?? ev.link ?? null;
                    const img = ev.image ?? undefined;
                    const label = (ev.linkText && ev.linkText.trim()) || "learn more";
                    const summary = (ev.desc ?? ev.description ?? "").trim() || null;

                    return (
                      <Reveal key={`${year}-${i}-${ev.role}-${ev.org ?? ""}`} delay={(yi * 0.02) + i * 0.045}>
                        {/* Resume text cell — translucent, refined */}
                        <div className="entry-wrap rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm transition hover:bg-white/[0.03]">
                          <TimelineItem event={ev} />
                        </div>

                        {/* Compact link button-card below, aligned to the SAME left start as resume text */}
                        {href && (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group mt-2 block overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] px-4 py-0 backdrop-blur-sm transition hover:bg-white/[0.04] md:px-5"
                          >
                            {/* inside the card, create a row that aligns with TimelineItem’s text start via the same horizontal padding (px-4/md:px-5) */}
                            <div className="flex min-h-[84px] items-stretch gap-4">
                              {/* image pane: 20% on sm+, stacked on mobile; does NOT shift the left edge because padding is on the anchor */}
                              <div className="relative hidden select-none sm:block sm:w-[20%]">
                                {img ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={img} alt="" className="h-full w-full object-cover brightness-95 transition group-hover:brightness-100" />
                                ) : (
                                  <div className="h-full w-full bg-neutral-800/60" />
                                )}
                              </div>

                              {/* text column */}
                              <div className="flex min-w-0 flex-1 items-center justify-between py-3">
                                <div className="min-w-0 pr-3">
                                  <p className="truncate text-sm text-neutral-200">
                                    <span className="bg-[linear-gradient(white,white)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-200 group-hover:bg-[length:100%_1px]">
                                      {label}
                                    </span>
                                  </p>
                                  {summary && (
                                    <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-neutral-400">
                                      {summary}
                                    </p>
                                  )}
                                </div>
                                <span aria-hidden className="shrink-0 text-neutral-400 transition group-hover:translate-x-0.5">
                                  →
                                </span>
                              </div>
                            </div>
                          </a>
                        )}
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* pinned ChatGPT fab */}
      <ExperienceChatFab />

      {/* Hide any inline anchors inside TimelineItem so link text appears only in the button-card */}
      <style jsx>{`
        .entry-wrap :global(a) { display: none; }
      `}</style>
    </PageTransition>
  );
}
