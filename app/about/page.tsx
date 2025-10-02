"use client";

import { PageTransition } from "@/components/PageTransition";
import { TimelineItem } from "@/components/TimelineItem";
import Reveal from "@/components/Reveal";
import timeline from "@/data/timeline.json";
import type { TimelineEvent } from "@/types/timeline";
import { m, useReducedMotion } from "framer-motion";

export default function AboutPage() {
  const items = timeline as TimelineEvent[];
  const prefersReduced = useReducedMotion();

  return (
    <PageTransition>
      <Reveal>
        <section className="prose-invert">
          <h1 className="text-2xl font-semibold tracking-tight">about</h1>
          <p className="mt-3 max-w-prose text-muted">highlights and a straightforward career timeline.</p>
        </section>
      </Reveal>

      <m.ol
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: prefersReduced ? 0 : 0.06 } } }}
        className="relative mt-8 space-y-6 border-l border-subtle pl-6"
      >
        {items.map((ev) => (
          <TimelineItem key={ev.year + ev.role} event={ev} />
        ))}
      </m.ol>
    </PageTransition>
  );
}
