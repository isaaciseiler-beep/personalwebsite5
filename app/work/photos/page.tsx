"use client";

import { useState } from "react";
import { PageTransition } from "@/components/PageTransition";
import Reveal from "@/components/Reveal";
import PhotoCard from "@/components/PhotoCard";
import dynamic from "next/dynamic";
import data from "@/data/projects.json";
import type { Project } from "@/types/project";
import { Lightbox } from "@/components/Lightbox";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function PhotosPage() {
  const photos = (data as Project[]).filter((p) => p.kind === "photo");
  const [lightbox, setLightbox] = useState({ open: false, src: null as string | null, alt: "" });

  return (
    <PageTransition>
      <Reveal>
        <h1 className="text-2xl font-semibold tracking-tight">photos</h1>
      </Reveal>
      <Reveal>
        <p className="mt-3 max-w-prose text-muted">selected images, mapped by location where available.</p>
      </Reveal>

      <Reveal>
        <div className="mt-6">
          <MapView photos={photos} />
        </div>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 md:grid-cols-3">
        {photos.map((item, i) => (
          <Reveal key={item.slug} delay={i * 0.04}>
            <div className="h-full">
              <PhotoCard item={item} onClick={(src, alt) => setLightbox({ open: true, src, alt })} />
            </div>
          </Reveal>
        ))}
      </div>

      <Lightbox
        open={lightbox.open}
        src={lightbox.src}
        alt={lightbox.alt}
        onClose={() => setLightbox({ open: false, src: null, alt: "" })}
      />
    </PageTransition>
  );
}
