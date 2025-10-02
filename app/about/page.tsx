"use client";

import { PageTransition } from "@/components/PageTransition";
import { TimelineItem } from "@/components/TimelineItem";
import Reveal from "@/components/Reveal";
import timeline from "@/data/timeline.json";
import type { TimelineEvent } from "@/types/timeline";

export default function AboutPage() {
  const items = timeline as TimelineEvent[];

  return (
    <PageTransition>
      <Reveal>
        <section className="prose-invert">
          <h1 className="text-2xl font-semibold tracking-tight">about</h1>
          <p className="mt-3 max-w-prose text-muted">
            highlights and a straightforward timeline.
          </p>
        </section>
      </Reveal>

      <ol className="relative mt-8 space-y-6 border-l border-subtle pl-6">
        {items.map((ev) => (
          <TimelineItem key={`${ev.dates}-${ev.role}-${ev.org ?? ""}`} event={ev} />
        ))}
      </ol>
    </PageTransition>
  );
}
