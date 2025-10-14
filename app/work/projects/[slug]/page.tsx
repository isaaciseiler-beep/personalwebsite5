// app/work/projects/[slug]/page.tsx — FULL REPLACEMENT
import { notFound } from "next/navigation";
import projects from "@/data/projects.json";
import ShimmerImage from "@/components/ShimmerImage";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const dynamicParams = false;

type Project = {
  title: string;
  slug: string;
  kind: string;
  image?: string;
  date?: string;
  excerpt?: string;
  contentHtml?: string;
  tags?: string[];
};

const all = (projects as Project[]).filter((p) => p.kind === "project");

export async function generateStaticParams() {
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = all.find((x) => x.slug === params.slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.excerpt ?? "Project",
    openGraph: {
      title: p.title,
      description: p.excerpt ?? "",
      images: p.image ? [{ url: p.image, width: 1200, height: 630 }] : undefined,
      type: "article",
    },
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = all.find((p) => p.slug === params.slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-20">
      <header>
        {project.image && (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <ShimmerImage
              src={project.image}
              alt={project.title}
              width={1600}
              height={900}
              className="w-full object-cover"
            />
          </div>
        )}
        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-[color:var(--color-fg)]">
          {project.title}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[color:var(--color-fg)]/60">
          {project.date && (
            <time dateTime={project.date}>
              {new Date(project.date).toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </time>
          )}
          {project.tags?.length ? <span aria-hidden>•</span> : null}
          {project.tags?.length ? (
            <ul className="flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-white/10 px-2 py-0.5 text-xs"
                >
                  {t}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {project.excerpt && (
          <p className="mt-4 text-[color:var(--color-fg)]/80">{project.excerpt}</p>
        )}
      </header>

      <section
        className="prose prose-invert mt-10 max-w-none text-[color:var(--color-fg)]/90"
        dangerouslySetInnerHTML={{ __html: project.contentHtml ?? "" }}
      />

      <footer className="mt-16 border-t border-white/10 pt-6 text-sm text-[color:var(--color-fg)]/60">
        <a href="/work/projects" className="hover:underline">
          ← Back to all projects
        </a>
      </footer>
    </article>
  );
}
