"use client";

import { PageTransition } from "@/components/PageTransition";
import Reveal from "@/components/Reveal";
import { Card } from "@/components/Card";
import data from "@/data/projects.json";
import type { Project } from "@/types/project";
import { useMemo, useState } from "react";
import TagFilter from "@/components/TagFilter";

export default function ProjectsPage() {
  const all = (data as Project[]).filter(p => p.kind === "project");
  const options = useMemo(() => {
    const set = new Set<string>();
    all.forEach(p => p.tags?.forEach(t => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [all]);

  const [selected, setSelected] = useState<string[]>([]);
  const items = selected.length
    ? all.filter(p => (p.tags ?? []).some(t => selected.includes(t)))
    : all;

  return (
    <PageTransition>
      <Reveal><h1 className="text-2xl font-semibold tracking-tight">projects</h1></Reveal>
      <Reveal><p className="mt-3 max-w-prose text-muted">filter by tags.</p></Reveal>

      <div className="mt-4">
        <TagFilter options={options} selected={selected} onChange={setSelected} label="tags:" />
      </div>

      <div className="mt-6 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 md:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.slug} delay={i * 0.04}>
            <div className="h-full"><Card item={item} /></div>
          </Reveal>
        ))}
      </div>
    </PageTransition>
  );
}
