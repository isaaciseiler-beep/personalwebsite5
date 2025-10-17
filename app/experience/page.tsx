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
  linkText?: string | null;       // your custom button copy (preferred)
  desc?: string | null;           // long blurb
  description?: string | null;    // alt key for long blurb
  org?: string | null;
};

export default function ExperiencePage() {
  const events = items as Linked[];

  // One bucket per item:
  // - Force Communications Director and Transition Aide into 2023
  // - Else use MAX year from dates; fallback current year
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
      const forced2023 =
        role.includes("communications director") || role.includes("transition aide");
      const year = forced2023 ? 2023 : (maxYear(ev.dates) ?? new Date().getFullYear());
      map.set(year, [...(map.get(year) ?? []), ev]);
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

      {/* education (unchanged) */}
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
          {/* left spine only */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-[0.5rem] top-0 h-full w-px bg-[linear-gradient(180deg,rgba(255,255,255,.28),rgba(255,255,255,.06))]"
          />

          {byYear.map(([year, list], yi) => (
            <li key={year} className="space-y-6">
              {/* between-years separator (not full-width pill) */}
              {yi > 0 && (
                <div className="-mx-4 px-4">
                  <div className="h-px w-full bg-[linear-gradient(90deg,rgba(255,255,255,.18),transparent)]" />
                </div>
              )}

              {/* compact sticky year pill; does not span screen */}
              <div className="sticky top-[88px] z-30">
                <span className="inline-flex items-center gap-2 rounded-full border border-subtle bg-[color:var(--color-bg)]/60 px-3 py-1 text-xs text-muted backdrop-blur">
                  {year}
                </span>
              </div>

              {/* entries */}
              <div className="relative border-l border-subtle pl-6">
                <div className="space-y-6">
                  {list.map((ev, i) => (
                    <Reveal
                      key={`${year}-${i}-${ev.role}-${ev.org ?? ""}`}
                      delay={(yi * 0.02) + i * 0.045}
                    >
                      {/* 1) Resume text (no cell wrapper) */}
                      <TimelineItem event={ev} />

                      {/* 2) Compact button-card below; left edge aligned with resume text start; no borders */}
                      {renderLinkButton(ev)}
                    </Reveal>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* pinned ChatGPT fab */}
      <ExperienceChatFab />

      {/* Hide any inline anchors inside TimelineItem so button owns the link text */}
      <style jsx>{`
        :global(.entry a), :global(.entry-link), :global(.learn-more) { display: none !important; }
      `}</style>
    </PageTransition>
  );
}

/* ===== Helpers ===== */

function isCSG(ev: Linked) {
  const org = (ev.org ?? "").toLowerCase();
  return /csg|council of state governments/.test(org);
}

function renderLinkButton(ev: Linked) {
  const href = ev.href ?? ev.link ?? null;
  if (!href) return null;

  // Primary button text: original custom linkText; else long blurb; CSG uses short label only.
  const hasCustom = !!(ev.linkText && ev.linkText.trim());
  const long = (ev.linkText?.trim() || ev.desc?.trim() || ev.description?.trim() || "");
  const label = isCSG(ev) ? "learn more" : long || "learn more";
  const img = ev.image ?? undefined;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-2 block overflow-hidden rounded-xl bg-white/[0.02] px-4 py-0 backdrop-blur-sm transition hover:bg-white/[0.04] md:px-5"
    >
      {/* row aligned by padding; NO borders */}
      <div className="flex min-h-[72px] items-stretch gap-4">
        {/* image 20% on sm+, stacked on mobile */}
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

        {/* text only inside the button; clamp to keep compact */}
        <div className="flex min-w-0 flex-1 items-center justify-between py-3">
          <p className={`min-w-0 pr-3 text-sm text-neutral-200 ${isCSG(ev) ? "truncate" : "line-clamp-2"}`}>
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
