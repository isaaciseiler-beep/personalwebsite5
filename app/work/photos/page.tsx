// app/work/photos/page.tsx — FULL REPLACEMENT (uses next/image instead of <img>)
"use client";

import { useEffect, useMemo, useState } from "react";
import { PageTransition } from "@/components/PageTransition";
import Reveal from "@/components/Reveal";
import dynamic from "next/dynamic";
import Image from "next/image";
import data from "@/data/projects.json";
import type { Project } from "@/types/project";
import { Lightbox } from "@/components/Lightbox";
import TagFilter from "@/components/TagFilter";
import { motion, AnimatePresence } from "framer-motion";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

function RatioClass(i: number) {
  const r = i % 6;
  if (r === 0 || r === 3) return "h-[420px]";
  if (r === 1 || r === 4) return "h-[300px]";
  return "h-[360px]";
}

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
  const [mapExpanded, setMapExpanded] = useState(false);

  const items = all.filter((p) => {
    const tagOk = tags.length ? (p.tags ?? []).some((t) => tags.includes(t)) : true;
    const locOk = locs.length ? (p.location ? locs.includes(p.location) : false) : true;
    return tagOk && locOk;
  });

  const gallery = items.map((p) => ({ src: p.image ?? "", alt: p.title }));
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });

  return (
    <PageTransition>
      <Reveal><h1 className="text-3xl md:text-4xl font-semibold tracking-tight">photos &amp; videos</h1></Reveal>

      {/* map block */}
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-end gap-2">
          <button
            onClick={() => setMapExpanded((v) => !v)}
            className="rounded-xl border border-subtle px-3 py-1.5 text-sm hover:border-[color:var(--color-accent)]/60"
            aria-expanded={mapExpanded}
          >
            {mapExpanded ? "minimize map" : "expand map"}
          </button>
        </div>
        <Reveal>
          <MapView photos={items} expanded={mapExpanded} />
        </Reveal>
      </div>

      {/* filter drawer */}
      <div className="mt-4">
        <button
          onClick={() => setFiltersOpen(v => !v)}
          className="rounded-xl border border-subtle px-4 py-2 hover:border-[color:var(--color-accent)]/60"
        >
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

      {/* magazine-style masonry with next/image */}
      <div className="mt-6 masonry">
        {items.map((item, i) => (
          <div key={item.slug} className="masonry-item">
            <Reveal delay={i * 0.04}>
              <button
                aria-label={`view ${item.title}`}
                className="group relative block h-full text-left"
                onClick={() => setLightbox({ open: true, index: i })}
              >
                <div className={`relative overflow-hidden rounded-xl border border-subtle bg-card ${RatioClass(i)}`}>
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-200 ease-[cubic-bezier(.2,0,0,1)] group-hover:scale-[1.02]"
                    />
                  )}
                  {/* hover caption */}
                  <div className="caption-bar pointer-events-none absolute inset-x-0 bottom-0">
                    <div className="mx-2 mb-2 rounded-lg bg-[color:var(--color-bg)]/60 px-3 py-1.5 text-sm backdrop-blur">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">{item.title}</span>
                        {item.location && (
                          <span className="rounded-full border border-subtle px-2 py-0.5 text-xs text-muted">
                            {item.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
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
