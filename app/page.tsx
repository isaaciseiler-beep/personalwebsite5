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
import PressShowcase from "@/components/PressShowcase";

export default function HomePage() {
  const all = projects as Project[];
  const featuredProjects = all.filter(p => p.kind === "project").slice(0, 3);

  const featuredPhotoSlugs = ["photo-08", "photo-12", "photo-10"];
  const photos = featuredPhotoSlugs
    .map(slug => all.find(p => p.slug === slug))
    .filter(Boolean) as Project[];

  const gallery = photos.map(p => ({
    src: p.image ?? "",
    alt: p.title,
    caption: p.location || p.title,
  }));

  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  return (
    <PageTransition>
      <EdgeProgress />
      <Hero />

      {/* unified container for consistent section widths */}
      <div className="mx-auto max-w-5xl px-4">
        <div className="space-y-6 md:space-y-8">
          {/* about */}
          <PinnedAbout
            compact
            lines={[
              "designerly research at the edge of ai and policy.",
              "shipping visual explainers and field notes.",
              "based in taipei • open to collabs.",
            ]}
            imageName="about/isaac-about-card.jpg"
          />

          {/* projects */}
          <section className="m-0 p-0">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xl leading-none">featured projects</h2>
              <Link
                href="/work/projects"
                className="link-underline text-sm text-muted hover:text-[color:var(--color-accent)]"
                prefetch
              >
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
          </section>

          {/* in the news — normalized header + full-width content */}
          <section
            className="
              m-0 p-0
              [&_h2]:text-xl [&_h2]:leading-none [&_h2]:mb-2
              [&_[role='tablist']]:w-full
              [&_[role='tab']]:flex-1 [&_[role='tab']]:text-center
              [&_*]:max-w-none
            "
          >
            <div className="mb-2 flex items-center justify-between">
              <h2>in the news</h2>
              <Link
                href="/press"
                className="link-underline text-sm text-muted hover:text-[color:var(--color-accent)]"
                prefetch
              >
                see all
              </Link>
            </div>
            <PressShowcase />
          </section>

          {/* featured photos */}
          <section className="m-0 p-0">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xl leading-none">featured photos</h2>
              <Link
                href="/work/photos"
                className="link-underline text-sm text-muted hover:text-[color:var(--color-accent)]"
                prefetch
              >
                see all
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {photos.map((item, i) => (
                <Reveal key={item.slug} delay={i * 0.06}>
                  <PhotoCard
                    item={item}
                    onClick={() => {
                      setIdx(i);
                      setOpen(true);
                    }}
                  />
                </Reveal>
              ))}
            </div>
          </section>
        </div>
      </div>

      <NowBar text={now.text ?? ""} />
      <Lightbox
        open={open}
        items={gallery}
        index={idx}
        setIndex={setIdx}
        onClose={() => setOpen(false)}
      />
    </PageTransition>
  );
}
