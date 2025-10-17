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

const DEFAULT_LONG =
  "Check out one of the campaigns I consulted for here, including the website I built";

export default function ExperiencePage() {
  const events = items as Linked[];

  // One bucket per item (no duplicates)
  // Force rules:
  //  - 2023: communications director, transition aide
  //  - 2021: research assistant
  //  - 2024: freelance/consult communications
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
      if (role.includes("communications director") || role.includes("transition aide")) {
        y = 2023;
      } else if (role.includes("research assistant")) {
        y = 2021;
      } else if (
        role.includes("freelance") ||
        role.includes("consult") ||
        org.includes("freelance") ||
        org.includes("consult")
      ) {
        y = 2024;
      } else {
        y = maxYear(ev.dates) ?? new Date().getFullYear();
      }

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

      {/* education — frozen (no hover reactions) */}
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

        <ol className="relative space-y-10">
          {/* single left spine */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-[0.5rem] top-0 h-full w-px bg-[linear-gradient(180deg,rgba(255,255,255,.28),rgba(255,255,255,.06))]"
          />

          {byYear.map(([year, list], yi) => (
            <li key={year} className="space-y-9">{/* +50% spacing (was 6 → 9) */}
              {/* between-years separator; starts AFTER the spine to avoid messy cross */}
              {yi > 0 && (
                <div className="ml-6">
                  <div className="h-px w-full bg-[linear-gradient(90deg,rgba(255,255,255,.18),transparent)]" />
                </div>
              )}

              {/* compact sticky year pill; less see-through so spine doesn’t show through */}
              <div className="sticky top-[96px] z-30">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/14 px-3 py-1 text-xs text-neutral-300 backdrop-blur-md shadow-[0_0_0_1px_rgba(0,0,0,.25)_inset]">
                  {year}
                </span>
              </div>

              {/* entries (no inner borders) */}
              <div className="relative pl-6">
                <div className="space-y-9">
                  {list.map((ev, i) => (
                    <Reveal key={`${year}-${i}-${ev.role}-${ev.org ?? ""}`} delay={(yi * 0.02) + i * 0.045}>
                      {/* resume text (plain) */}
                      <TimelineItem event={ev} />

                      {/* button cell below */}
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

      {/* page-scoped overrides */}
      <style jsx>{`
        /* freeze any hover transforms/shadows inside education */
        .freeze-card :global(.card-hover),
        .freeze-card :global(.card-hover:hover),
        .freeze-card :global(.card-hover:active) {
          transform: none !important;
          box-shadow: none !important;
          border-color: var(--color-border) !important;
        }
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

  const fallback = isCSG(ev) ? "learn more" : DEFAULT_LONG;
  const label =
    (ev.linkText && ev.linkText.trim()) ||
    (ev.desc && ev.desc.trim()) ||
    (ev.description && ev.description.trim()) ||
    fallback;

  const img = ev.image ?? undefined;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-2 block overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm transition hover:bg-white/[0.04]"
    >
      {/* Row: image must touch the card's left rounded corner.
          We keep content aligned with resume text by adding container padding,
          then pull the image left with a matching negative margin. */}
      <div className="flex min-h-[84px] items-stretch gap-4 px-4 md:px-5">
        {/* image 20% on sm+; bleed into left padding so it fills rounded corner */}
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

        {/* text */}
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
