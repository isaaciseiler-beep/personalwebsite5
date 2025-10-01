// app/about/page.tsx
import { PageTransition } from "@/components/PageTransition";
import { TimelineItem } from "@/components/TimelineItem";
import timeline from "@/data/timeline.json";
import type { TimelineEvent } from "@/types/timeline";

export const metadata = { title: "about — isaac seiler" };

export default function AboutPage() {
  const items = timeline as TimelineEvent[];
  return (
    <PageTransition>
      <section className="prose-invert">
        <h1 className="text-2xl font-semibold tracking-tight">about</h1>
        <p className="mt-3 max-w-prose text-muted">highlights and a straightforward career timeline.</p>
      </section>
      <ol className="relative mt-8 space-y-6 border-l border-subtle pl-6">
        {items.map(ev => (<TimelineItem key={ev.year + ev.role} event={ev} />))}
      </ol>
    </PageTransition>
  );
}

