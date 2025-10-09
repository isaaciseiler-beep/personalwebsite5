// app/work/projects/page.tsx — PATCH (ensure cards link to detail pages)
import Link from "next/link";
import projects from "@/data/projects.json";
import ShimmerImage from "@/components/ShimmerImage";

type Project = {
  title: string;
  slug: string;
  kind: string;
  image?: string;
  excerpt?: string;
  tags?: string[];
};

const all = (projects as Project[]).filter(p => p.kind === "project");

export default function ProjectsIndex() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
      <p className="mt-2 text-[color:var(--color-fg)]/70">
        Selected work, case studies, and experiments.
      </p>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2">
        {all.map(p => (
          <li key={p.slug}>
            <Link
              href={`/work/projects/${p.slug}`}
              className="group block overflow-hidden rounded-xl border border-white/10 supports-[backdrop-filter]:backdrop-blur-md bg-transparent"
            >
              {p.image && (
                <ShimmerImage
                  src={p.image}
                  alt={p.title}
                  width={1200}
                  height={630}
                  className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-medium text-[color:var(--color-fg)] group-hover:text-current">
                  {p.title}
                </h2>
                {p.excerpt && (
                  <p className="mt-1 line-clamp-2 text-sm text-[color:var(--color-fg)]/70">
                    {p.excerpt}
                  </p>
                )}
                {p.tags?.length ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map(t => (
                      <li key={t} className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-[color:var(--color-fg)]/70">
                        {t}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
