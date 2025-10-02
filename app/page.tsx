// app/page.tsx — FULL FILE (home orchestrator)
"use client";

import { PageTransition } from "@/components/PageTransition";
import Reveal from "@/components/Reveal";
import Hero from "@/components/Hero";
import EdgeProgress from "@/components/EdgeProgress";
import PinnedAbout from "@/components/PinnedAbout";
import Filmstrip from "@/components/Filmstrip";
import PressRow from "@/components/PressRow";
import NowBar from "@/components/NowBar";
import { Card } from "@/components/Card";
import PhotoCard from "@/components/PhotoCard";
import projectsData from "@/data/projects.json";
import featured from "@/data/featured.json";
import now from "@/data/now.json";
import type { Project } from "@/types/project";
import Link from "next/link";
import { useState } from "react";
import { Lightbox } from "@/components/Lightbox";

export default function HomePage() {
  const all = projectsData as Project[];

  const featuredProjectIds = (featured.projects ?? []) as string[];
  const featuredPhotoIds = (featured.photos ?? []) as string[];
  const filmstripIds = (featured.filmstrip ?? []) as string[];

  const featuredProjects = all.filter(p => p.kind === "project" && featuredProjectIds.includes(p.slug)).slice(0, 3);
  const featuredPhotos   = all.filter(p => p.kind !== "project" && featuredPhotoIds.includes(p.slug)).slice(0, 3);
  const filmstripItems   = all.filter(p => filmstripIds.includes(p.slug)).map(p => ({
    src: p.video ?? p.image ?? "",
    alt: p.title,
    kind: p.kind === "video" ? "video" as const : "photo" as const
  }));

  // lightbox for featured photos and filmstrip
  const gallery = featuredPhotos.map(p => ({ src: p.image ?? "", alt: p.title }));
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });

  return (
    <PageTransition>
      <EdgeProgress />
      <Hero />

      {/* pinned about */}
      <PinnedAbout
        lines={[
          "designerly research at the edge of ai and policy.",
          "shipping visual explainers and field notes.",
          "based in taipei • open to collabs."
        ]}
        images={["/images/sample1.svg", "/images/sample2.svg", "/images/sample3.svg"]}
      />

      {/* featured projects */}
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
                <div className="h-full">
                  <Card item={item} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* filmstrip */}
      <section className="mx-auto max-w-5xl px-4">
        <Reveal>
          <Filmstrip
            items={filmstripItems}
            onOpen={(i) => setLightbox({ open: true, index: i })}
          />
        </Reveal>
      </section>

      {/* map ribbon lives on /work/photos; keep home lean */}

      {/* featured photos */}
      <section className="pb-10">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl">featured photos</h2>
            <Link href="/work/photos" className="link-underline text-sm text-muted hover:text-[color:var(--color-accent)]" prefetch>
              see all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {featuredPhotos.map((item, i) => (
              <Reveal key={item.slug} delay={i * 0.06}>
                <div className="h-full">
                  <PhotoCard item={item} onClick={() => setLightbox({ open: true, index: i })} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* press + now */}
      <PressRow items={featured.press ?? []} />
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
