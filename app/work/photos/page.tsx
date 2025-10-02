"use client";

import { useState } from "react";
import { PageTransition } from "@/components/PageTransition";
import PhotoCard from "@/components/PhotoCard";
import MapView from "@/components/MapView";
import data from "@/data/projects.json";
import type { Project } from "@/types/project";
import { Lightbox } from "@/components/Lightbox";

export default function PhotosPage() {
  const photos = (data as Project[]).filter(p => p.kind === "photo");

  const [lightbox, setLightbox] = useState<{ open: boolean; src: string | null; alt: string }>({
    open: false,
    src: null,
    alt: ""
  });

  return (
    <PageTransition>
      <h1 className="text-2xl font-semibold tracking-tight">photos</h1>
      <p className="mt-3 max-w-prose text-muted">
        selected images, mapped by location where available.
      </p>

      {/* map shows only when photos have coordinates */}
      <div className="mt-6">
        <MapView photos={photos} />
      </div>

      <div className="mt-6 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 md:grid-cols-3">
        {photos.map(item => (
          <div key={item.slug} className="h-full">
            <PhotoCard
              item={item}
              onClick={(src, alt) => setLightbox({ open: true, src, alt })}
            />
          </div>
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
