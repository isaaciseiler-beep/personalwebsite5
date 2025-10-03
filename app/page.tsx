// app/page.tsx — FULL REPLACEMENT (featured photos restored; uses PhotoCard + captions in lightbox)
"use client";

import { PageTransition } from "@/components/PageTransition";
import Reveal from "@/components/Reveal";
import Hero from "@/components/Hero";
import { Card } from "@/components/Card";
import PhotoCard from "@/components/PhotoCard";
import projects from "@/data/projects.json";
import type { Project } from "@/types/project";
import Link from "next/link";
import { useState } from "react";
import { Lightbox } from "@/components/Lightbox";
import EdgeProgress from "@/components/EdgeProgress";
import PinnedAbout from "@/components/PinnedAbout";
import now from "@/data/now.json";
import NowBar from "@/components/NowBar";

export default function HomePage() {
  const all = projects as Project[];
  const featuredProjects = all.filter(p => p.kind === "project").slice(0, 3);
  const photos = all.filter(p => p.kind === "photo").slice(0, 3);

  const gallery = photos.map(p => ({ src: p.image ?? "", alt: p.title, caption: p.location || p.title }));
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  return (
    <PageTransition>
      <EdgeProgress />
      <Hero />

      <PinnedAbout
        lines={[
          "designerly research at the edge of ai and policy.",
          "shipping visual explainers and field notes.",
          "based in taipei • open to collabs."
        ]}
        images={["/images/sample1.svg", "/images/sample2.svg", "/images/sample3.svg"]}
      />

      {/* projects */}
      <section className="py-8">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl">featured projects</h2>
            <Link href="/work/projects" className="link-underline text-sm text-muted hover:text-[color:var(--color-accent)]" prefetch>
              see all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {featuredProjects.map((item, i) => (
              <Reveal key={item.slug} delay={i * 0.06}>
                <div className="h-full"><Card item={item} /></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* featured photos */}
      <section className="pb-8">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl">featured photos</h2>
            <Link href="/work/photos" className="link-underline text-sm text-muted hover:text-[color:var(--color-accent)]" prefetch>
              see all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {photos.map((item, i) => (
              <Reveal key={item.slug} delay={i * 0.06}>
                <PhotoCard item={item} onClick={() => { setIdx(i); setOpen(true); }} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <NowBar text={now.text ?? ""} />
      <Lightbox open={open} items={gallery} index={idx} setIndex={setIdx} onClose={() => setOpen(false)} />
    </PageTransition>
  );
}
