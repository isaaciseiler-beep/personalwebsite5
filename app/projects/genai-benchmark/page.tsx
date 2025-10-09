"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import ShimmerImage from "@/components/ShimmerImage";

const ScoreChart = dynamic(() => import("./ScoreChart"), { ssr: false });
const USMap = dynamic(() => import("./USMap"), { ssr: false });
const RadarProfile = dynamic(() => import("./RadarProfile"), { ssr: false });
const TimelineChart = dynamic(() => import("./TimelineChart"), { ssr: false });

export default function GenAIBenchmarkPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-20">
      {/* HERO */}
      <motion.header
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <ShimmerImage
            src="/images/genai-benchmark-cover.jpg"
            alt="The GenAI Benchmark"
            width={1600}
            height={900}
            className="w-full object-cover"
          />
        </div>
        <h1 className="mt-8 text-5xl font-semibold tracking-tight text-[color:var(--color-fg)]">
          The GenAI Benchmark
        </h1>
        <p className="mt-3 max-w-2xl text-[color:var(--color-fg)]/70">
          A 56-government index benchmarking how U.S. states and territories
          deploy and regulate generative AI inside government.
        </p>
      </motion.header>

      {/* INTRO */}
      <Section
        title="Overview"
        text="This benchmark, produced through the Council of State Governments, evaluates fifty states, five territories, and the District of Columbia on generative-AI adoption. Fifteen criteria track readiness across implementation, infrastructure, and workforce enablement. A composite efficiency index corrects for differences in government size, creating a fairer national comparison."
      />

      {/* VISUALS */}
      <Section title="Top Performing States">
        <p className="text-[color:var(--color-fg)]/80 mb-4">
          Maryland, California, Arizona, Georgia, and Pennsylvania lead the
          GenAI era. Their composite scores reflect a blend of transparency,
          permanent infrastructure, and employee training.
        </p>
        <ScoreChart />
      </Section>

      <Section title="Nationwide Readiness Map">
        <p className="text-[color:var(--color-fg)]/80 mb-4">
          The choropleth below shows composite readiness scores across the U.S.
          Hover over a state to see its score. Lighter shades indicate stronger
          public AI governance structures and employee enablement.
        </p>
        <USMap />
      </Section>

      <Section title="Readiness Profile by Category">
        <p className="text-[color:var(--color-fg)]/80 mb-4">
          Averaged across all governments, implementation outpaces workforce
          preparation. The radar plot compares the top-five average with the
          national mean across three categories.
        </p>
        <RadarProfile />
      </Section>

      <Section title="Policy Momentum Over Time">
        <p className="text-[color:var(--color-fg)]/80 mb-4">
          Generative-AI legislation and executive orders surged in 2024. This
          timeline tracks cumulative policy actions, showing accelerating
          momentum.
        </p>
        <TimelineChart />
      </Section>

      <Section title="Key Insights">
        <ul className="list-disc list-inside text-[color:var(--color-fg)]/80 space-y-2">
          <li>Transparency is the single best predictor of success.</li>
          <li>States with employee training score 20–30 points higher on average.</li>
          <li>Permanent offices and published strategy plans strongly correlate with readiness.</li>
        </ul>
      </Section>

      <motion.section
        className="mt-20 border-t border-white/10 pt-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <blockquote className="text-xl italic text-[color:var(--color-fg)]/80">
          “Generative AI can redefine how governments serve people—but only if
          they approach it with transparency and foresight.”
        </blockquote>
        <p className="mt-6 text-[color:var(--color-fg)]/70">
          The GenAI Benchmark continues to evolve, integrating live data and
          interactive dashboards. It serves as a blueprint for evidence-based AI
          governance in the public sector.
        </p>
        <a
          href="/work/projects"
          className="inline-block mt-8 text-sm text-[color:var(--color-fg)]/60 hover:text-current hover:underline"
        >
          ← Back to all projects
        </a>
      </motion.section>
    </article>
  );
}

function Section({
  title,
  text,
  children,
}: {
  title: string;
  text?: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.section
      className="mt-20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {text && <p className="text-[color:var(--color-fg)]/80 mb-6">{text}</p>}
      {children}
    </motion.section>
  );
}
