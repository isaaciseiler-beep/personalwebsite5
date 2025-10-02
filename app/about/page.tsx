"use client";

import { PageTransition } from "@/components/PageTransition";
import { TimelineItem } from "@/components/TimelineItem";
import timeline from "@/data/timeline.json";
import type { TimelineEvent } from "@/types/timeline";
import { motion, useReducedMotion } from "framer-motion";

export const metadata = { title: "about — isaac seiler" };

export default function AboutPage() {
  const items = timeline as TimelineEvent[];
  const prefersReducedMotion = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.06
      }
    }
  };

  return (
    <PageTransition>
      <section className="prose-invert">
        <h1 className="text-2xl font-semibold tracking-tight">about</h1>
        <p className="mt-3 max-w-prose text-muted">highlights and a straightforward career timeline.</p>
      </section>

      <motion.ol
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px" }}
        className="relative mt-8 space-y-6 border-l border-subtle pl-6"
      >
        {items.map((ev) => (
          <TimelineItem key={ev.year + ev.role} event={ev} />
        ))}
      </motion.ol>
    </PageTransition>
  );
}

