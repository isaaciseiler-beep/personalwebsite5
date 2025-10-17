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
  linkText?: string | null;
  desc?: string | null;
  description?: string | null;
};

export default function ExperiencePage() {
  const events = items as Linked[];

  // Assign EACH item to a SINGLE year bucket.
  // Rules:
  // 1) If role matches "communications director" or "transition aide" → 2023.
  // 2) Else use the MAX year found in dates; if none, use current year.
  const byYear = useMemo(() => {
    const getMaxYear = (s?: string) => {
      if (!s) return null;
      const m = s.match(/\b(19|20)\d{2}\b/g);
      if (!m) return null;
      return Math.max(...m.map((x) => parseInt(x, 10)));
    };

    const map = new Map<number, Linked[]>();
    for (const ev of events) {
      const role = (ev.role ?? "").toLowerCase();
      let year: number | null = null;

      if (role.includes("communications director") || role.includes("transition aide")) {
        year = 2023;
      } else {
        year = getMaxYear(ev.dates) ?? new Date().getFullYear();
      }

      map.set(year, [...(map.get(year) ?? []), ev]);
    }

    // sort years desc
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [events]);

  return (
    <PageTransition>
      {/* header */}
      <section className="mx-auto max-w-5xl px-4 pt-12 md:pt-16">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-3xl font-semibold tracking-tight md:text-5xl"
        >
          experience
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mt-3 max-w-3xl text-sm text-muted md:text-base"
        >
          Roles across media, policy, and applied AI.
        </motion.p>
      </section>

      {/* education (fixed) */}
      <section className="mx-auto mt-8 max-w-5xl px-4">
        <h2 className="mb-4 text-xl">education</h2>
        <Reveal>
          <ExperienceEducation />
        </Reveal>
      </section>

      {/* timeline */}
      <section className="mx-auto mt-10 max-w-5xl px-4 pb-14">
        <h2 className="mb-4 text-xl">professional experience</h2>

        <ol className="relative space-y-10">
          <span
            aria-hidden
            className="pointer-events-none absolute left-[0.5rem] top-0 h-full w-px bg-[linear-gradient(180deg,rgba(255,255,255,.28),rgba(255,255,255,.06))]"
          />
          {byYear.map(([year, list], yi) => (
            <li key={year} className="space-y-6">
              {/* sticky year chip */}
              <div className="sticky top-[64px] z-10 -mx-4 px-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-subtle px-2 py-0.5 text-xs text-muted">{year}</span>
                  <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(255,255,255,.18),transparent)]" />
                </div>
              </div>

              <div className="relative border-l border-subtle pl-6">
                <div className="space-y-6">
                  {list.map((ev, i) => {
                    const href = ev.href ?? ev.link ?? null;
                    const img = ev.image ?? undefined;
                    const label = (ev.linkText && ev.linkText.trim()) || "learn more";
                    const key = `${year}-${i}-${ev.role}-${ev.org ?? ""}`;

                    return (
                      <Reveal key={key} delay={(yi * 0.02) + i * 0.045}>
                        {/* Resume text (exactly as TimelineItem renders it) */}
                        <div className="entry-wrap rounded-xl bg-white/[0.015] transition hover:bg-white/[0.03]">
                          <TimelineItem event={ev} />
                        </div>

                        {/* Compact link button-card below (only if link exists) */}
                        {href && (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group mt-2 flex min-h-[72px] w-full overflow-hidden rounded-xl border border-neutral-800/70 bg-neutral-950/80 text-left text-neutral-100 shadow-[0_0_16px_rgba(0,0,0,0.18)] backdrop-blur-md transition hover:bg-white/[0.03]"
                          >
                            {/* image pane: 20% on sm+, stacked on mobile */}
                            <div className="relative hidden select-none sm:block sm:flex-[0_0_20%]">
                              {img ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={img} alt="" className="h-full w-full object-cover brightness-95 transition group-hover:brightness-100" />
                              ) : (
                                <div className="h-full w-full bg-neutral-800" />
                              )}
                            </div>

                            {/* compact text/button label ONLY inside the card */}
                            <div className="flex min-w-0 flex-1 items-center justify-between gap-3 p-3 md:p-4">
                              <p className="truncate text-sm text-neutral-300">
                                <span className="bg-[linear-gradient(white,white)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-200 group-hover:bg-[length:100%_1px]">
                                  {label}
                                </span>
                              </p>
                              <span aria-hidden className="shrink-0 text-neutral-400 transition group-hover:translate-x-0.5">
                                →
                              </span>
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

      {/* pinned chatgpt fab */}
      <ExperienceChatFab />

      {/* hide any inline anchors INSIDE TimelineItem to ensure link text appears only in the button-card */}
      <style jsx>{`
        .entry-wrap :global(a) {
          display: none;
        }
      `}</style>
    </PageTransition>
  );
}
