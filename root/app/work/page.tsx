// app/work/page.tsx
"use client";

import { useState } from "react";
import { PageTransition } from "@/components/PageTransition";
import { Card } from "@/components/Card";
import { FilterPills } from "@/components/FilterPills";
import { Lightbox } from "@/components/Lightbox";
import projects from "@/data/projects.json";
import type { Project } from "@/types/project";

export default function WorkPage() {
  const [filter, setFilter] = useState<"all" | "project" | "photo">("all");
  const [lightbox, setLightbox] = useState<{ open: boolean; src: string | null; alt: string }>({ open: false, src: null, alt: "" });

  const items = (projects as Project[]).filter(p => (filter === "all" ? true : p.kind === filter));

  return (
    <PageTransition>
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">work</h1>
        <p className="mt-3 max-w-prose text-muted">projects and photos.</p>
        <div className="mt-4">
          <FilterPills value={filter} onChange={setFilter} />
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {items.map(item => (
          <Card key={item.slug} item={item} onPhotoClick={(src, alt) => setLightbox({ open: true, src, alt })} />
        ))}
      </section>

      <Lightbox open={lightbox.open} src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox({ open: false, src: null, alt: "" })} />
    </PageTransition>
  );
}

