"use client";

import { PageTransition } from "@/components/PageTransition";
import { TimelineItem } from "@/components/TimelineItem";
import Reveal from "@/components/Reveal";
import timeline from "@/data/timeline.json";
import type { TimelineEvent } from "@/types/timeline";
import { m, useReducedMotion } from "framer-motion";

export default function AboutPage() {
  const items = (timeline as TimelineEvent[]).map(ev => ({ group: "career", ...ev })); // default group
  const groups: Record<Required<TimelineEvent>["group"], TimelineEvent[]> = {
    career: items.filter(i => i.group === "career"),
    creative: items.filter(i => i.group === "creative"),
    research: items.filter(i => i.group === "research")
  };
  const prefersReduced = useReducedMotion();

  const Group = ({ title, list }: { title: string; list: TimelineEvent[] }) =>
    list.length === 0 ? null : (
      <section className="mt-8">
        <Reveal><h2 className="text-xl">{title}</h2></Reveal>
        <m.ol
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: prefersReduced ? 0 : 0.06 } } }}
          className="relative mt-4 space-y-6 border-l border-subtle pl-6"
        >
          {list.map(ev => <TimelineItem key={ev.year + ev.role} event={ev} />)}
        </m.ol>
      </section>
    );

  return (
    <PageTransition>
      <Reveal>
        <section className="prose-invert">
          <h1 className="text-2xl font-semibold tracking-tight">about</h1>
          <p className="mt-3 max-w-prose text-muted">highlights and a grouped career timeline.</p>
        </section>
      </Reveal>
      <Group title="career" list={groups.career} />
      <Group title="creative" list={groups.creative} />
      <Group title="research" list={groups.research} />
    </PageTransition>
  );
}
