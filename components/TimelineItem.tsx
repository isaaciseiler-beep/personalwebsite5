"use client";

import { m } from "framer-motion";
import Link from "next/link";
import type { TimelineEvent } from "@/types/timeline";
import { Briefcase, Palette, FlaskConical } from "lucide-react";

const child = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18, ease: [0.2, 0, 0, 1] } }
};

function GroupIcon({ group }: { group?: TimelineEvent["group"] }) {
  const g = group ?? "career";
  const cls = "inline-block align-middle mr-2 text-muted";
  if (g === "creative") return <Palette size={16} className={cls} />;
  if (g === "research") return <FlaskConical size={16} className={cls} />;
  return <Briefcase size={16} className={cls} />;
}

export function TimelineItem({ event }: { event: TimelineEvent }) {
  return (
    <m.li variants={child} className="relative pl-6">
      <span className="absolute left-0 top-2 h-3 w-3 rounded-full bg-accent/70" />
      <div className="text-sm text-muted">{event.year}</div>
      <div className="mt-1 text-lg">
        <GroupIcon group={event.group} />
        {event.role} {event.org && <span className="text-muted">· {event.org}</span>}
      </div>
      {event.summary && <p className="mt-1 text-muted">{event.summary}</p>}
      {event.link && (
        <Link href={event.link} className="link-underline mt-2 inline-block text-sm hover:text-accent" target="_blank">
          more
        </Link>
      )}
    </m.li>
  );
}
