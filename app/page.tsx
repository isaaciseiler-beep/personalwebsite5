// app/page.tsx — FULL REPLACEMENT (featured photos render; 3 square cards)
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
import featured from "@/data/featured.json";
import now from "@/data/now.json";
import NowBar from "@/components/NowBar";

export default function HomePage() {
  const all = projects as Project[];

  const featuredProjects = all.filter(p => p.kind === "project").slice(0, 3);
  // fallback: if featured.json doesn’t list photos, take the first 3 photos
  const listed = (featured as any)?.photos as string[] | undefined;
  const photos = listed && listed.length
    ? all.filter(p => p.kind === "photo" && listed.includes(p.slug)).slice(0, 3)
    : all.filter(p => p.kind === "photo").slice(0, 3);

  const gallery = photos.map(p => ({ src: p.image ?? "", alt: p.title }));
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });

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

      {/* photos: 3 squares */}
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
                <PhotoCard item={item} onClick={() => setLightbox({ open: true, index: i })} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <NowBar text={now.text ?? ""} />
      <Lightbox
        open={lightbox.open}
        items={gallery}
        index={lightbox.index}
        setIndex={(i) => setLightbox(s => ({ ...s, index: i }))}
        onClose={() => setLightbox({ open: false, index: 0 })}
      />
    </PageTransition>
  );
}
