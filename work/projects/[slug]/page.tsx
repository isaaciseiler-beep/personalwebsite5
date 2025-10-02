import { notFound } from "next/navigation";
import data from "@/data/projects.json";
import type { Project } from "@/types/project";
import Image from "next/image";
import Link from "next/link";
import { PageTransition } from "@/components/PageTransition";

export function generateStaticParams() {
  const items = data as Project[];
  return items.filter(p => p.kind === "project").map(p => ({ slug: p.slug }));
}

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const items = data as Project[];
  const item = items.find(p => p.kind === "project" && p.slug === params.slug);
  if (!item) return notFound();

  return (
    <PageTransition>
      <article>
        <Link href="/work/projects" className="text-sm text-muted link-underline hover:text-accent">← back to projects</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">{item.title}</h1>
        {item.year && <div className="mt-1 text-sm text-muted">{item.year}</div>}
        {item.image && (
          <div className="mt-6 overflow-hidden rounded-xl border border-subtle bg-card">
            <Image
              src={item.image}
              alt={item.title}
              width={1600}
              height={1000}
              className="w-full h-auto object-cover"
              priority
              sizes="100vw"
            />
          </div>
        )}
        {item.summary && <p className="mt-4 max-w-prose text-muted">{item.summary}</p>}
        {item.tags && (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.map(t => (
              <span key={t} className="rounded-full border border-subtle px-2 py-0.5 text-xs text-muted">{t}</span>
            ))}
          </div>
        )}
        {item.url && (
          <div className="mt-6">
            <Link href={item.url} target="_blank" className="rounded-xl border border-subtle px-4 py-2 hover:border-accent/60">
              visit project ↗
            </Link>
          </div>
        )}
      </article>
    </PageTransition>
  );
}
