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
          Roles and projects across media, policy, and applied AI.
        </motion.p>
      </section>

      {/* education */}
      <section className="mx-auto mt-8 max-w-5xl px-4">
        <h2 className="mb-4 text-xl">education</h2>
        <Reveal>
          <ExperienceEducation />
        </Reveal>
      </section>

      {/* experience timeline */}
      <section className="mx-auto mt-10 max-w-5xl px-4 pb-10">
        <h2 className="mb-4 text-xl">professional experience</h2>

        <ol className="relative space-y-10">
          {byYear.map(([year, list]) => (
            <li key={year} className="space-y-6">
              {/* sticky year label, consistent with site borders */}
              <div className="sticky top-[56px] z-10 -mx-4 px-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted">{year}</span>
                  <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(255,255,255,.22),transparent)]" />
                </div>
              </div>

              {/* timeline column */}
              <div className="relative border-l border-subtle pl-6">
                <span className="pointer-events-none absolute left-0 top-0 h-full w-px translate-x-[-1px] bg-[linear-gradient(180deg,rgba(255,255,255,.35),rgba(255,255,255,.06))]" />
                <div className="space-y-6">
                  {list.map((ev, i) => (
                    <Reveal key={`${ev.dates}-${ev.role}-${ev.org ?? ""}`} delay={i * 0.045}>
                      <TimelineItem event={ev} />
                    </Reveal>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* pinned ChatGPT FAB (unchanged) */}
      <ExperienceChatFab />
    </PageTransition>
  );
}
