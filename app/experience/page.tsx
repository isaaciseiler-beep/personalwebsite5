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

export default function ExperiencePage() {
  const events = items as TimelineEvent[];

  // group by year (desc)
  const byYear = useMemo(() => {
    const map = new Map<string, TimelineEvent[]>();
    for (const ev of events) {
      const y = (ev.dates ?? "").match(/\b(20\d{2}|19\d{2})\b/)?.[0] ?? "other";
      map.set(y, [...(map.get(y) ?? []), ev]);
    }
    return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
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

      {/* education */}
      <section className="mx-auto mt-8 max-w-5xl px-4">
        <h2 className="mb-4 text-xl">education</h2>
        <Reveal>
          <ExperienceEducation />
        </Reveal>
      </section>

      {/* professional timeline */}
      <section className="mx-auto mt-10 max-w-5xl px-4 pb-14">
        <h2 className="mb-4 text-xl">professional experience</h2>

        {/* spine with subtle progress sheen */}
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

              {/* entries */}
              <div className="relative border-l border-subtle pl-6">
                <div className="space-y-6">
                  {list.map((ev, i) => (
                    <Reveal key={`${ev.dates}-${ev.role}-${ev.org ?? ""}`} delay={(yi * 0.02) + i * 0.045}>
                      {/* slight row highlight on hover; monochrome */}
                      <div className="rounded-xl bg-white/[0.015] p-0 hover:bg-white/[0.03] transition">
                        <TimelineItem event={ev} />
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* pinned FAB (stays at bottom of frame) */}
      <ExperienceChatFab />
    </PageTransition>
  );
}
