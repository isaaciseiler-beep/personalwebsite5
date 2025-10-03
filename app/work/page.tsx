// app/work/page.tsx — FULL REPLACEMENT
// Fixes Lightbox usage to the new {items,index,setIndex} API.

"use client";

import { useState } from "react";
import { PageTransition } from "@/components/PageTransition";
import Reveal from "@/components/Reveal";
import projects from "@/data/projects.json";
import type { Project } from "@/types/project";
import { Card } from "@/components/Card";
import PhotoCard from "@/components/PhotoCard";
import { Lightbox } from "@/components/Lightbox";
import Link from "next/link";

export default function WorkPage() {
  const all = projects as Project[];
  const proj = all.filter((p) => p.kind === "project");
  const photos = all.filter((p) => p.kind === "photo").slice(0, 9);

  // lightbox state for the small photo sampler on /work
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const items = photos.map((p) => ({ src: p.image ?? "", alt: p.title, caption: p.location || p.title }));

  return (
    <PageTransition>
      <Reveal>
        <section className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">work</h1>
          <p className="mt-2 text-muted">projects and photos.</p>
        </section>
      </Reveal>

      {/* projects grid */}
      <section className="mb-10">
        <h2 className="text-xl mb-4">projects</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {proj.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.04}>
              <div className="h-full">
                <Card item={p} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* quick photo sampler that links to full gallery */}
      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl">photos</h2>
          <Link href="/work/photos" className="link-underline text-sm text-muted hover:text-[color:var(--color-accent)]">see all</Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {photos.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.03}>
              <PhotoCard item={p} onClick={() => { setIdx(i); setOpen(true); }} />
            </Reveal>
          ))}
        </div>
      </section>

      <Lightbox open={open} items={items} index={idx} setIndex={setIdx} onClose={() => setOpen(false)} />
    </PageTransition>
  );
}
