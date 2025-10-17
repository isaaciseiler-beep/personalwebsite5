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
  org?: string | null;
};

export default function ExperiencePage() {
  const events = items as Linked[];

  // One-year placement rules
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
      else if (role.includes("freelance") || role.includes("consult") || org.includes("freelance")) y = 2024;
      else y = maxYear(ev.dates) ?? new Date().getFullYear();
      map.set(y, [...(map.get(y) ?? []), ev]);
    }
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [events]);

  return (
    <PageTransition>
      {/* Header */}
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

      {/* Education (frozen) */}
      <section className="mx-auto mt-8 max-w-5xl px-4">
        <h2 className="mb-4 text-xl">education</h2>
        <div className="freeze-card">
          <Reveal>
            <ExperienceEducation />
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto mt-10 max-w-5xl px-4 pb-16">
        <h2 className="mb-4 text-xl">professional experience</h2>

        <ol className="relative space-y-10">
          {/* Single left spine */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-[0.5rem] top-0 h-full w-px bg-[linear-gradient(180deg,rgba(255,255,255,.28),rgba(255,255,255,.06))]"
          />

          {byYear.map(([year, list], yi) => (
            <li key={year} className="space-y-9">
              {/* Year separator */}
              {yi > 0 && (
                <div className="ml-6">
                  <div className="h-px w-full bg-[linear-gradient(90deg,rgba(255,255,255,.18),transparent)]" />
                </div>
              )}

              {/* Sticky year pill */}
              <div className="sticky top-[96px] z-30">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/15 px-3 py-1 text-xs text-neutral-300 backdrop-blur-md shadow-[0_0_0_1px_rgba(0,0,0,.25)_inset]">
                  {year}
                </span>
              </div>

              <div className="relative pl-6">
                <div className="space-y-9">
                  {list.map((ev, i) => (
                    <Reveal
                      key={`${year}-${i}-${ev.role}-${ev.org ?? ""}`}
                      delay={(yi * 0.02) + i * 0.045}
                    >
                      {/* Resume text (plain) */}
                      <TimelineItem event={ev} />

                      {/* Button below (long link text now inside) */}
                      {renderButtonCell(ev)}
                    </Reveal>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <ExperienceChatFab />

      {/* Freeze hover inside education */}
      <style jsx>{`
        .freeze-card :global(.card-hover),
        .freeze-card :global(.card-hover:hover),
        .freeze-card :global(.card-hover:active) {
          transform: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </PageTransition>
  );
}

/* === HELPERS === */

function isCSG(ev: Linked) {
  const org = (ev.org ?? "").toLowerCase();
  return /csg|council of state governments/.test(org);
}

function renderButtonCell(ev: Linked) {
  const href = ev.href ?? ev.link ?? null;
  if (!href) return null;

  const img = ev.image ?? undefined;

  // Pull each entry's original link text. Fallback: CSG → learn more; others → desc/description.
  const label = isCSG(ev)
    ? "learn more"
    : ev.linkText?.trim() || ev.desc?.trim() || ev.description?.trim() || "";

  if (!label) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-3 block overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm transition hover:bg-white/[0.04]"
    >
      {/* Aligns left with resume text */}
      <div className="flex min-h-[84px] items-stretch gap-4 px-4 md:px-5">
        {/* Image flush with left rounded corner */}
        <div className="relative hidden select-none sm:block sm:w-[20%] -ml-4 md:-ml-5 rounded-l-xl overflow-hidden">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img}
              alt=""
              className="h-full w-full object-cover brightness-95 transition group-hover:brightness-100"
            />
          ) : (
            <div className="h-full w-full bg-neutral-800/60" />
          )}
        </div>

        {/* Long link text inside button */}
        <div className="flex min-w-0 flex-1 items-center justify-between py-3">
          <p className="min-w-0 pr-3 text-sm text-neutral-200 leading-snug line-clamp-3">
            <span className="bg-[linear-gradient(white,white)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-200 group-hover:bg-[length:100%_1px]">
              {label}
            </span>
          </p>
          <span
            aria-hidden
            className="shrink-0 text-neutral-400 transition group-hover:translate-x-0.5"
          >
            →
          </span>
        </div>
      </div>
    </a>
  );
}
