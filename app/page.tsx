import { PageTransition } from "@/components/PageTransition";
import Reveal from "@/components/Reveal";
import Hero from "@/components/Hero";
import { Card } from "@/components/Card";
import projects from "@/data/projects.json";
import type { Project } from "@/types/project";
import Link from "next/link";

export default function HomePage() {
  const featured = (projects as Project[]).slice(0, 3);

  return (
    <PageTransition>
      <Hero />

      <section className="pt-8 pb-8">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl">featured</h2>
            <Link
              href="/work"
              className="link-underline text-sm text-muted hover:text-[color:var(--color-accent)]"
              prefetch
            >
              see all
            </Link>
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
        </div>
      </section>
    </PageTransition>
  );
}
