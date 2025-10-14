// app/work/photos/page.tsx — FULL REPLACEMENT (MapView via dynamic import, ssr:false)
"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { PageTransition } from "@/components/PageTransition";
import Reveal from "@/components/Reveal";
import PhotoCard from "@/components/PhotoCard";
import data from "@/data/projects.json";
import type { Project } from "@/types/project";
import { Lightbox } from "@/components/Lightbox";

// IMPORTANT: avoid SSR for map (prevents "document is not defined")
const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function PhotosPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const all = (data as Project[]).filter((p) => p.kind === "photo");
  const [visible, setVisible] = useState(12);
  const shown = useMemo(() => all.slice(0, visible), [all, visible]);

  // map should use all geotagged items, not just shown slice
  const withCoords = useMemo(
    () =>
      all.filter(
        (p) =>
          p.location &&
          typeof p.location.lat === "number" &&
          typeof p.location.lng === "number"
      ),
    [all]
  );

  // lightbox
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const items = shown.map((p) => ({
    src: p.image ?? "",
    alt: p.title,
    caption: p.location?.name || p.title,
  }));

  return (
    <PageTransition>
      <Reveal>
        <h1 className="text-2xl font-semibold tracking-tight">photos</h1>
      </Reveal>

      {/* visible map (client-only) */}
      <Reveal>
        <div className="mt-6">
          <MapView projects={withCoords} />
        </div>
      </Reveal>

      {/* 16:9, two per row */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2">
        {shown.map((item, i) => (
          <Reveal key={item.slug} delay={i * 0.03}>
            <PhotoCard
              item={item}
              ratio="video"
              onClick={() => {
                setIdx(i);
                setOpen(true);
              }}
            />
          </Reveal>
        ))}
      </div>

      {visible < all.length && (
        <div className="mt-6">
          <button
            onClick={() => setVisible((v) => v + 12)}
            className="rounded-xl border border-subtle px-4 py-2 hover:border-[color:var(--color-accent)]/60"
          >
            load more
          </button>
        </div>
      )}

      <Lightbox
        open={open}
        items={items}
        index={idx}
        setIndex={setIdx}
        onClose={() => setOpen(false)}
      />
    </PageTransition>
  );
}
