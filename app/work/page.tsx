// app/work/page.tsx — FULL REPLACEMENT (query + lightbox, type-safe search)
"use client";

import { useMemo, useState } from "react";
import { PageTransition } from "@/components/PageTransition";
import Reveal from "@/components/Reveal";
import projects from "@/data/projects.json";
import type { Project } from "@/types/project";
import { Card } from "@/components/Card";
import PhotoCard from "@/components/PhotoCard";
import { Lightbox } from "@/components/Lightbox";
import Link from "next/link";

type Params = { searchParams?: { query?: string } };

export default function WorkPage({ searchParams }: Params) {
  const q = (searchParams?.query ?? "").trim();
  const all = projects as Project[];

  const { proj, photos, total } = useMemo(() => {
    if (!q) {
      const proj = all.filter((p) => p.kind === "project");
      const photos = all.filter((p) => p.kind === "photo").slice(0, 9);
      return { proj, photos, total: proj.length + photos.length };
    }
    const text = q.toLowerCase();

    const match = (p: Project) => {
      const tags = Array.isArray((p as any).tags) ? (p as any).tags.join(" ") : "";
      const desc = (p as any)?.description ?? "";
      const hay = [p.title, p.location, p.summary, desc, tags]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(text);
    };

    const hits = all.filter(match);
    return {
      proj: hits.filter((p) => p.kind === "project"),
      photos: hits.filter((p) => p.kind === "photo"),
      total: hits.length,
    };
  }, [q, all]);

  // lightbox state for photo grid
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const items = photos.map((p) => ({
    src: p.image ?? "",
    alt: p.title,
    caption: p.location || p.title,
  }));

  const hasQuery = q.length > 0;

  return (
    <PageTransition>
      <Reveal>
        <section className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            {hasQuery ? (
              <>
                results for <span className="font-semibold">“{q}”</span>
              </>
            ) : (
              "work"
            )}
          </h1>
          <p className="mt-2 text-muted">
            {hasQuery ? `${total} match${total === 1 ? "" : "es"}` : "projects and photos."}
          </p>
        </section>
      </Reveal>

      {proj.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl">projects</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {proj.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.04}>
                <div className="h-full">
                  <Card item={p} />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl">photos</h2>
          {!hasQuery && (
            <Link
              href="/work/photos"
              className="link-underline text-sm text-muted hover:text-[color:var(--color-accent)]"
            >
              see all
            </Link>
          )}
        </div>
        {photos.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {photos.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.03}>
                <PhotoCard
                  item={p}
                  onClick={() => {
                    setIdx(i);
                    setOpen(true);
                  }}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-[color:var(--color-fg)]/75">No photo matches.</p>
        )}
      </section>

      {hasQuery && total === 0 && (
        <p className="text-[color:var(--color-fg)]/75">No matches. Try different keywords.</p>
      )}

      <Lightbox open={open} items={items} index={idx} setIndex={setIdx} onClose={() => setOpen(false)} />
    </PageTransition>
  );
}
