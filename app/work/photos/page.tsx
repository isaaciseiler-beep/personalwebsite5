// app/work/photos/page.tsx — FULL FILE (masonry gallery)
"use client";

import { useEffect, useMemo, useState } from "react";
import { PageTransition } from "@/components/PageTransition";
import Reveal from "@/components/Reveal";
import PhotoCard from "@/components/PhotoCard";
import dynamic from "next/dynamic";
import data from "@/data/projects.json";
import type { Project } from "@/types/project";
import { Lightbox } from "@/components/Lightbox";
import TagFilter from "@/components/TagFilter";
import { motion, AnimatePresence } from "framer-motion";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function PhotosPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const all = (data as Project[]).filter((p) => p.kind === "photo");

  const tagOptions = useMemo(() => {
    const set = new Set<string>();
    all.forEach((p) => p.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [all]);

  const locOptions = useMemo(() => {
    const set = new Set<string>();
    all.forEach((p) => p.location && set.add(p.location));
    return Array.from(set).sort();
  }, [all]);

  const [tags, setTags] = useState<string[]>([]);
  const [locs, setLocs] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const items = all.filter((p) => {
    const tagOk = tags.length ? (p.tags ?? []).some((t) => tags.includes(t)) : true;
    const locOk = locs.length ? (p.location ? locs.includes(p.location) : false) : true;
    return tagOk && locOk;
  });

  const gallery = items.map((p) => ({ src: p.image ?? "", alt: p.title }));
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });

  return (
    <PageTransition>
      <Reveal><h1 className="text-2xl font-semibold tracking-tight">photos</h1></Reveal>
      <Reveal><p className="mt-3 max-w-prose text-muted">filter by tags and location; mapped where available.</p></Reveal>

      <div className="mt-4">
        <button onClick={() => setFiltersOpen(v => !v)} className="rounded-xl border border-subtle px-4 py-2 hover:border-[color:var(--color-accent)]/60">
          {filtersOpen ? "hide filters" : "show filters"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {filtersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.2,0,0,1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 flex flex-col gap-2">
              <TagFilter options={tagOptions} selected={tags} onChange={setTags} label="tags:" />
              <TagFilter options={locOptions} selected={locs} onChange={setLocs} label="location:" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Reveal><div className="mt-6"><MapView photos={items} /></div></Reveal>

      {/* magazine-style masonry */}
      <div className="mt-6 masonry">
        {items.map((item, i) => (
          <div key={item.slug} className="masonry-item">
            <Reveal delay={i * 0.04}>
              <PhotoCard item={item} onClick={() => setLightbox({ open: true, index: i })} />
            </Reveal>
          </div>
        ))}
      </div>

      <Lightbox
        open={lightbox.open}
        items={gallery}
        index={lightbox.index}
        setIndex={(i) => setLightbox((s) => ({ ...s, index: i }))}
        onClose={() => setLightbox({ open: false, index: 0 })}
      />
    </PageTransition>
  );
}
