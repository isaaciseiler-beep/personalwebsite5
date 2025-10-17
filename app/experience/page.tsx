"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import Reveal from "@/components/Reveal";
import ExperienceEducation from "@/components/ExperienceEducation";
import { TimelineItem } from "@/components/TimelineItem";
import items from "@/data/timeline.json";
import type { TimelineEvent } from "@/types/timeline";

type Linked = TimelineEvent & { href?: string | null; link?: string | null; image?: string | null };

export default function ExperiencePage() {
  const events = items as Linked[];

  // expand year ranges (e.g., "2021–2023") so missing years like 2023 get their own group
  const byYear = useMemo(() => {
    const yearMap = new Map<string, Linked[]>();
    const extractYears = (s: string | undefined) => {
      if (!s) return [];
      const m = s.match(/\b(19|20)\d{2}\b/g);
      if (!m) return [];
      if (m.length === 1) return [parseInt(m[0], 10)];
      const a = parseInt(m[0], 10), b = parseInt(m[m.length - 1], 10);
      const [start, end] = a <= b ? [a, b] : [b, a];
      const res: number[] = [];
      for (let y = start; y <= end; y++) res.push(y);
      return res;
    };
    for (const ev of events) {
      const years = extractYears(ev.dates) as number[];
      if (years.length === 0) years.push(new Date().getFullYear());
      for (const y of years) {
        const k = String(y);
        yearMap.set(k, [...(yearMap.get(k) ?? []), ev]);
      }
    }
    return Array.from(yearMap.entries()).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [events]);

  const header = (
    <section className="mx-auto max-w-5xl px-4 pt-12 md:pt-16">
      <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="text-3xl font-semibold tracking-tight md:text-5xl">
        experience
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="mt-3 max-w-3xl text-sm text-muted md:text-base">
        Roles across media, policy, and applied AI.
      </motion.p>
    </section>
  );

  return (
    <PageTransition>
      {header}

      {/* education (unchanged, stays a fixed bubble section) */}
      <section className="mx-auto mt-8 max-w-5xl px-4">
        <h2 className="mb-4 text-xl">education</h2>
        <Reveal>
          <ExperienceEducation />
        </Reveal>
      </section>

      {/* timeline with filled years and link-cards */}
      <section className="mx-auto mt-10 max-w-5xl px-4 pb-14">
        <h2 className="mb-4 text-xl">professional experience</h2>

        <ol className="relative space-y-10">
          {/* spine */}
          <span aria-hidden className="pointer-events-none absolute left-[0.5rem] top-0 h-full w-px bg-[linear-gradient(180deg,rgba(255,255,255,.28),rgba(255,255,255,.06))]" />
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
                    const hasLink = !!href;
                    const img = (ev as any).image as string | undefined;

                    return (
                      <Reveal key={`${year}-${i}-${ev.role}-${ev.org ?? ""}`} delay={(yi * 0.02) + i * 0.045}>
                        {hasLink ? (
                          /* LINK → FULL-WIDTH CARD (20% image, 80% text), monochrome, clickable */
                          <a
                            href={href!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex min-h-[120px] w-full overflow-hidden rounded-2xl border border-neutral-800/70 bg-neutral-950/80 text-left text-neutral-100 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur-md transition hover:bg-white/[0.03]"
                          >
                            {/* image pane 20% */}
                            <div className="relative hidden flex-[0_0_20%] select-none sm:block">
                              {img ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={img} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full bg-neutral-800" />
                              )}
                            </div>
                            {/* text pane */}
                            <div className="flex min-w-0 flex-[1] flex-col justify-center gap-1 p-5">
                              <h3 className="text-[1.05rem] leading-snug tracking-tight">
                                <span className="bg-[linear-gradient(white,white)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size,transform] duration-300 group-hover:bg-[length:100%_2px]">
                                  {ev.role}{ev.org ? ` — ${ev.org}` : ""}
                                </span>
                              </h3>
                              {ev.dates && <p className="text-sm text-neutral-400">{ev.dates}</p>}
                              {ev.desc && <p className="mt-1 line-clamp-3 text-sm text-neutral-300">{ev.desc}</p>}
                            </div>
                          </a>
                        ) : (
                          <div className="rounded-xl bg-white/[0.015] transition hover:bg-white/[0.03]">
                            <TimelineItem event={ev} />
                          </div>
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
    </PageTransition>
  );
}
