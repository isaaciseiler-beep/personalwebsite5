// app/experience/page.tsx — FULL FILE
"use client";

import { PageTransition } from "@/components/PageTransition";
import Reveal from "@/components/Reveal";
import ExperienceEducation from "@/components/ExperienceEducation";
import { TimelineItem } from "@/components/TimelineItem";
import ExperienceSummary from "@/components/ExperienceSummary";
import items from "@/data/timeline.json";
import type { TimelineEvent } from "@/types/timeline";

export default function ExperiencePage() {
  const events = items as TimelineEvent[];
  return (
    <PageTransition>
      {/* top breathing room + big header */}
      <section className="mx-auto max-w-5xl px-4 pt-12 md:pt-16">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">experience</h1>
      </section>

      {/* education cell */}
      <section className="mx-auto max-w-5xl px-4 mt-8">
        <h2 className="text-xl mb-4">education</h2>
        <ExperienceEducation />
      </section>

      {/* openai summary helper */}
      <section className="mx-auto max-w-5xl px-4 mt-8">
        <ExperienceSummary />
      </section>

      {/* professional experience */}
      <section className="mx-auto max-w-5xl px-4 mt-10">
        <h2 className="text-xl mb-4">professional experience</h2>
        <ol className="relative space-y-6 border-l border-subtle pl-6">
          {events.map((ev) => (
            <Reveal key={`${ev.dates}-${ev.role}-${ev.org ?? ""}`}>
              <TimelineItem event={ev} />
            </Reveal>
          ))}
        </ol>
      </section>
    </PageTransition>
  );
}
