import { PageTransition } from "@/components/PageTransition";
import Reveal from "@/components/Reveal";
import { Card } from "@/components/Card";
import data from "@/data/projects.json";
import type { Project } from "@/types/project";

export default function ProjectsPage() {
  const items = (data as Project[]).filter((p) => p.kind === "project");
  return (
    <PageTransition>
      <Reveal>
        <h1 className="text-2xl font-semibold tracking-tight">projects</h1>
      </Reveal>
      <Reveal>
        <p className="mt-3 max-w-prose text-muted">all projects.</p>
      </Reveal>
      <div className="mt-6 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 md:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.slug} delay={i * 0.04}>
            <div className="h-full">
              <Card item={item} />
            </div>
          </Reveal>
        ))}
      </div>
    </PageTransition>
  );
}
