// app/page.tsx — FULL REPLACEMENT
"use client";

import { PageTransition } from "@/components/PageTransition";
import Reveal from "@/components/Reveal";
import Hero from "@/components/Hero";
import { Card } from "@/components/Card";
import projects from "@/data/projects.json";
import type { Project } from "@/types/project";
import Link from "next/link";
import EdgeProgress from "@/components/EdgeProgress";
import PinnedAbout from "@/components/PinnedAbout";
import now from "@/data/now.json";
import NowBar from "@/components/NowBar";
import PressShowcase from "@/components/PressShowcase";
import FeaturedPhotos from "@/components/FeaturedPhotos";

export default function HomePage() {
  const all = projects as Project[];
  const featuredProjects = all.filter((p) => p.kind === "project").slice(0, 3);

  const featuredPhotoSlugs = ["photo-08", "photo-12", "photo-10"];
  const photos = featuredPhotoSlugs
    .map((slug) => all.find((p) => p.slug === slug))
    .filter(Boolean) as Project[];

  return (
    <PageTransition>
      <EdgeProgress />
      <Hero />

      <PinnedAbout
        blurbs={[
          "Fulbright scholar documenting AI uses in education",
          "Expert on digital disruption and innovation in journalism and media",
          "Served as the youngest Communications Director in congressional history",
          "Photographer, videographer, and internationally licensed drone pilot",
          "Member of ChatGPT Lab @ OpenAI, informing product decisions",
          "Skilled strategic communicator with cross-sector experience",
        ]}
        image="https://pub-41d52824b0bb4f44898c39e1c3c63cb8.r2.dev/about.jpg"
      />

      {/* projects */}
      <section className="py-8">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl">featured projects</h2>
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
        </div>
      </section>

      {/* featured photos ABOVE news, full-bleed */}
      <section className="pb-8">
        <div className="-mx-4 sm:-mx-6 lg:-mx-8">
          <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
            <FeaturedPhotos photos={photos} />
          </div>
        </div>
      </section>

      {/* news */}
      <PressShowcase />
      <NowBar text={now.text ?? ""} />
    </PageTransition>
  );
}
