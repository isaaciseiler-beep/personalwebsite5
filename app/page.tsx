import { PageTransition } from "@/components/PageTransition";
import Reveal from "@/components/Reveal";
import { Card } from "@/components/Card";
import projects from "@/data/projects.json";
import type { Project } from "@/types/project";
import Link from "next/link";

export default function HomePage() {
  const featured = (projects as Project[]).slice(0, 3);
  return (
    <PageTransition>
      <Reveal>
        <section className="py-12">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">isaac seiler</h1>
          <p className="mt-3 max-w-prose text-muted">
            building and documenting work at the edge of ai, policy, and visual storytelling.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/about" className="rounded-xl border border-subtle px-4 py-2 hover:border-accent/60">about</Link>
            <Link href="/work" className="rounded-xl border border-subtle px-4 py-2 hover:border-accent/60">work</Link>
          </div>
        </section>
      </Reveal>

      <section className="py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl">featured</h2>
          <Link href="/work" className="link-underline text-sm text-muted hover:text-accent">see all</Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {featured.map((item, i) => (
            <Reveal key={item.slug} delay={i * 0.06}>
              <div className="h-full">
                <Card item={item} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
