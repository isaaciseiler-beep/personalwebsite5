import { PageTransition } from "@/components/PageTransition";
import { Card } from "@/components/Card";
import data from "@/data/projects.json";
import type { Project } from "@/types/project";

export const metadata = { title: "projects — isaac seiler" };

export default function ProjectsPage() {
  const items = (data as Project[]).filter(p => p.kind === "project");
  return (
    <PageTransition>
      <h1 className="text-2xl font-semibold tracking-tight">projects</h1>
      <p className="mt-3 max-w-prose text-muted">all projects.</p>
      <div className="mt-6 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 md:grid-cols-3">
        {items.map(item => (
          <div key={item.slug} className="h-full">
            <Card item={item} />
          </div>
        ))}
      </div>
    </PageTransition>
  );
}
