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
  linkText?: string | null;       // your original long button copy
  desc?: string | null;           // blurb
  description?: string | null;    // alt blurb
  org?: string | null;
};

const DEFAULT_LONG =
  "Check out one of the campaigns I consulted for here, including the website I built";

export default function ExperiencePage() {
  const events = items as Linked[];

  // Put each item in exactly one year:
  //  - Force Communications Director & Transition Aide to 2023
  //  - Else the MAX year in its dates, fallback = current year
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

      {/* timeline */}
      <section className="mx-auto mt-10 max-w-5xl px-4 pb-16">
        <h2 className="mb-4 text-xl">professional experience</h2>

        <ol className="relative space-y-10">
          {/* the ONLY left line */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-[0.5rem] top-0 h-full w-px bg-[linear-gradient(180deg,rgba(255,255,255,.28),rgba(255,255,255,.06))]"
          />

          {byYear.map(([year, list], yi) => (
            <li key={year} className="space-y-6">
              {/* between-years separator ONLY */}
              {yi > 0 && (
                <div className="-mx-4 px-4">
                  <div className="h-px w-full bg-[linear-gradient(90deg,rgba(255,255,255,.18),transparent)]" />
                </div>
              )}

              {/* compact sticky year pill, translucent like header */}
              <div className="sticky top-[88px] z-30">
                <span className="inline-flex items-center gap-2 rounded-full border border-subtle bg-white/[0.02] px-3 py-1 text-xs text-muted backdrop-blur-sm">
                  {year}
                </span>
              </div>

              {/* entries (no inner left borders) */}
              <div className="relative pl-6">
                <div className="space-y-6">
                  {list.map((ev, i) => (
                    <Reveal
                      key={`${year}-${i}-${ev.role}-${ev.org ?? ""}`}
                      delay={(yi * 0.02) + i * 0.045}
                    >
                      {/* 1) Resume text — plain, no cell */}
                      <div className="entry-text">
                        <TimelineItem event={ev} />
                      </div>

                      {/* 2) Button cell below, left-aligned with text start */}
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

      {/* Hide original inline anchors so the sentence only appears inside the button cell */}
      <style jsx>{`
        .entry-text :global(p:has(a)),
        .entry-text :global(a) { display: none !important; }
      `}</style>
    </PageTransition>
  );
}

/* ===== Helpers ===== */

function isCSG(ev: Linked) {
  const org = (ev.org ?? "").toLowerCase();
  return /csg|council of state governments/.test(org);
}

function renderButtonCell(ev: Linked) {
  const href = ev.href ?? ev.link ?? null;
  if (!href) return null;

  const img = ev.image ?? undefined;

  // Button text priority:
  // 1) linkText (original sentence); 2) desc; 3) description; 4) DEFAULT_LONG (except CSG → "learn more")
  const fallback = isCSG(ev) ? "learn more" : DEFAULT_LONG;
  const label =
    (ev.linkText && ev.linkText.trim()) ||
    (ev.desc && ev.desc.trim()) ||
    (ev.description && ev.description.trim()) ||
    fallback;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-2 block overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] px-4 py-0 backdrop-blur-sm transition hover:bg-white/[0.04] md:px-5"
    >
      {/* row; cell restored; alignment via px-4/md:px-5 to match text inset */}
      <div className="flex min-h-[84px] items-stretch gap-4">
        {/* 20% image on sm+ */}
        <div className="relative hidden select-none sm:block sm:w-[20%]">
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

        {/* text inside the button */}
        <div className="flex min-w-0 flex-1 items-center justify-between py-3">
          <p className="min-w-0 pr-3 text-sm text-neutral-200 line-clamp-2">
            <span className="bg-[linear-gradient(white,white)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-200 group-hover:bg-[length:100%_1px]">
              {label}
            </span>
          </p>
          <span aria-hidden className="shrink-0 text-neutral-400 transition group-hover:translate-x-0.5">
            →
          </span>
        </div>
      </div>
    </a>
  );
}
