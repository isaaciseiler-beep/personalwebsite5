"use client";

import { useMemo, useState } from "react";
import { PageTransition } from "@/components/PageTransition";
import Reveal from "@/components/Reveal";
import PhotoCard from "@/components/PhotoCard";
import dynamic from "next/dynamic";
import data from "@/data/projects.json";
import type { Project } from "@/types/project";
import { Lightbox } from "@/components/Lightbox";
import TagFilter from "@/components/TagFilter";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function PhotosPage() {
  const all = (data as Project[]).filter(p => p.kind === "photo");

  const tagOptions = useMemo(() => {
    const set = new Set<string>();
    all.forEach(p => p.tags?.forEach(t => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [all]);

  const locOptions = useMemo(() => {
    const set = new Set<string>();
    all.forEach(p => p.location && set.add(p.location));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [all]);

  const [tags, setTags] = useState<string[]>([]);
  const [locs, setLocs] = useState<string[]>([]);

  const items = all.filter(p => {
    const tagOk = tags.length ? (p.tags ?? []).some(t => tags.includes(t)) : true;
    const locOk = locs.length ? (p.location ? locs.includes(p.location) : false) : true;
    return tagOk && locOk;
  });

  const gallery = items.map(p => ({ src: p.image ?? "", alt: p.title }));
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });

  return (
    <PageTransition>
      <Reveal><h1 className="text-2xl font-semibold tracking-tight">photos</h1></Reveal>
      <Reveal><p className="mt-3 max-w-prose text-muted">filter by tags and location; mapped where available.</p></Reveal>

      <div className="mt-4 flex flex-col gap-2">
        <TagFilter options={tagOptions} selected={tags} onChange={setTags} label="tags:" />
        <TagFilter options={locOptions} selected={locs} onChange={setLocs} label="location:" />
      </div>

      <Reveal>
        <div className="mt-6">
          <MapView photos={items} />
        </div>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 md:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.slug} delay={i * 0.04}>
            <div className="h-full">
              <PhotoCard
                item={item}
                onClick={() => setLightbox({ open: true, index: i })}
              />
            </div>
          </Reveal>
        ))}
      </div>

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
