// components/TimelineItem.tsx — FULL REPLACEMENT
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { TimelineEvent } from "@/types/timeline";

const child = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18, ease: [0.2, 0, 0, 1] } }
};

export function TimelineItem({ event }: { event: TimelineEvent }) {
  return (
    <motion.li variants={child} className="relative pl-6">
      <span className="absolute left-0 top-2 h-3 w-3 rounded-full bg-accent/70" />
      <div className="text-sm text-muted">{event.dates}</div>
      <div className="mt-1 text-lg">
        {event.role} {event.org && <span className="text-muted">· {event.org}</span>}
      </div>
      {event.summary && <p className="mt-1 text-muted">{event.summary}</p>}
      {event.link && event.link_text && (
        <Link
          href={event.link}
          className="link-underline mt-2 inline-block text-sm hover:text-accent"
          target="_blank"
          rel="noopener noreferrer"
        >
          {event.link_text}
        </Link>
      )}
    </motion.li>
  );
}
