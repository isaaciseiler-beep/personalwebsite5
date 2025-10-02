"use client";

import { useState } from "react";
import { PageTransition } from "@/components/PageTransition";
import { Card } from "@/components/Card";
import PhotoCard from "@/components/PhotoCard";
import { Lightbox } from "@/components/Lightbox";
import projectsData from "@/data/projects.json";
import type { Project } from "@/types/project";
import Link from "next/link";

export default function WorkLanding() {
  const all = projectsData as Project[];
  const projects = all.filter(p => p.kind === "project");
  const photos = all.filter(p => p.kind === "photo");

  const [lightbox, setLightbox] = useState<{ open: boolean; src: string | null; alt: string }>({
    open: false,
    src: null,
    alt: ""
  });

  return (
    <PageTransition>
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">work</h1>
        <p className="mt-3 max-w-prose text-muted">projects and photos.</p>
      </section>

      {/* projects preview */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl">projects</h2>
          <Link href="/work/projects" className="link-underline text-sm text-muted hover:text-accent">
            see more
          </Link>
        </div>
        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 md:grid-cols-3">
          {projects.slice(0, 6).map(item => (
            <div key={item.slug} className="h-full">
              <Card item={item} />
            </div>
          ))}
        </div>
      </section>

      {/* photos preview */}
      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl">photos</h2>
          <Link href="/work/photos" className="link-underline text-sm text-muted hover:text-accent">
            see gallery
          </Link>
        </div>
        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 md:grid-cols-3">
          {photos.slice(0, 6).map(item => (
            <div key={item.slug} className="h-full">
              <PhotoCard
                item={item}
                onClick={(src, alt) => setLightbox({ open: true, src, alt })}
              />
            </div>
          ))}
        </div>
      </section>

      <Lightbox
        open={lightbox.open}
        src={lightbox.src}
        alt={lightbox.alt}
        onClose={() => setLightbox({ open: false, src: null, alt: "" })}
      />
    </PageTransition>
  );
}
