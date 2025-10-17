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
  linkText?: string | null;   // camelCase
  link_text?: string | null;  // snake_case (as in your JSON)
  org?: string | null;
};

export default function ExperiencePage() {
  const events = items as Linked[];

  // single-year placement (no duplicates)
  const byYear = useMemo(() => {
    const maxYear = (s?: string) => {
      if (!s) return null;
      const m = s.match(/\b(19|20)\d{2}\b/g);
      if (!m) return null;
      return Math.max(...m.map((x) => parseInt(x, 10)));
    };
    const map = new Map<number, Linked[]>();
    for (const ev of events) {
      const role = (ev.role ?? "").toLowerCase();
      const org = (ev.org ?? "").toLowerCase();

      let y: number | null = null;
      if (role.includes("communications director") || role.includes("transition aide")) y = 2023;
      else if (role.includes("research assistant")) y = 2021;
      else if (role.includes("freelance") || role.includes("consult")) y = 2024;
      else y = maxYear(ev.dates) ?? new Date().getFullYear();

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

      {/* education (frozen) */}
      <section className="mx-auto mt-8 max-w-5xl px-4">
        <h2 className="mb-4 text-xl">education</h2>
        <div className="freeze-card">
          <Reveal>
            <ExperienceEducation />
          </Reveal>
        </div>
      </section>

      {/* timeline */}
      <section className="mx-auto mt-10 max-w-5xl px-4 pb-16">
        <h2 className="mb-4 text-xl">professional experience</h2>

        <ol className="relative space-y-9">
          {/* single left spine */}
          <span aria-hidden className="pointer-events-none absolute left-[0.5rem] top-0 h-full w-px bg-[linear-gradient(180deg,rgba(255,255,255,.28),rgba(255,255,255,.06))]" />

          {byYear.map(([year, list], yi) => (
            <li key={year} className="space-y-9">
              {/* between-year separator */}
              {yi > 0 && <div className="ml-6 h-px w-full bg-[linear-gradient(90deg,rgba(255,255,255,.18),transparent)]" />}

              {/* compact sticky year pill */}
              <div className="sticky top-[96px] z-30">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/15 px-3 py-1 text-xs text-neutral-300 backdrop-blur-md shadow-[0_0_0_1px_rgba(0,0,0,.25)_inset]">
                  {year}
                </span>
              </div>

              <div className="relative pl-6">
                <div className="space-y-9">
                  {list.map((ev, i) => (
                    <Reveal key={`${year}-${i}-${ev.role}-${ev.org ?? ""}`} delay={(yi * 0.02) + i * 0.045}>
                      {/* resume text (plain) */}
                      <TimelineItem event={ev} />

                      {/* image button with original link text inside */}
                      {renderImageButton(ev)}
                    </Reveal>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <ExperienceChatFab />

      {/* freeze hover inside education + hide any inline anchors from TimelineItem */}
      <style jsx>{`
        .freeze-card :global(.card-hover),
        .freeze-card :global(.card-hover:hover),
        .freeze-card :global(.card-hover:active) { transform: none !important; box-shadow: none !important; }
        :global(.entry a), :global(.learn-more), :global(.entry-link) { display: none !important; }
      `}</style>
    </PageTransition>
  );
}

/* helpers */

function isCSG(ev: Linked) {
  const org = (ev.org ?? "").toLowerCase();
  return /csg|council (of|for) state governments/.test(org);
}

function renderImageButton(ev: Linked) {
  const href = ev.href ?? ev.link ?? null;
  if (!href) return null;

  // Use JSON's snake_case link_text first, then camelCase linkText. CSG falls back to "learn more".
  const label = (ev.link_text?.trim() || ev.linkText?.trim() || (isCSG(ev) ? "learn more" : "")).trim();
  if (!label) return null;

  const img = ev.image ?? undefined;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-3 block overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm transition hover:bg-white/[0.04]"
    >
      {/* align with resume text start */}
      <div className="flex min-h-[84px] items-stretch gap-4 px-4 md:px-5">
        {/* image pane: flush with left corner */}
        <div className="relative hidden select-none sm:block sm:w-[20%] -ml-4 md:-ml-5 rounded-l-xl overflow-hidden">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt="" className="h-full w-full object-cover brightness-95 transition group-hover:brightness-100" />
          ) : (
            <div className="h-full w-full bg-neutral-800/60" />
          )}
        </div>

        {/* link text inside button */}
        <div className="flex min-w-0 flex-1 items-center justify-between py-3">
          <p className="min-w-0 pr-3 text-sm text-neutral-200 leading-snug line-clamp-3">
            <span className="bg-[linear-gradient(white,white)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-200 group-hover:bg-[length:100%_1px]">
              {label}
            </span>
          </p>
          <span aria-hidden className="shrink-0 text-neutral-400 transition group-hover:translate-x-0.5">→</span>
        </div>
      </div>
    </a>
  );
}
