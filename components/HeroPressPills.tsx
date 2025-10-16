"use client";

import CardMotion from "@/components/CardMotion";

export type Pill = { href: string; label: string };

export const PILLS: Pill[] = [
  { href: "https://openai.com/index/introducing-chatgpt-pulse/", label: "OpenAI: Introducing ChatGPT Pulse" },
  { href: "https://www.whitehouse.gov/briefing-room/statements-releases/2025/05/02/fact-sheet-biden-harris-administration-announces-new-actions-to-advance-safe-secure-and-trustworthy-artificial-intelligence-2/", label: "White House: AI actions mention" },
  { href: "https://truman.gov", label: "Truman Scholarship" },
  { href: "https://source.washu.edu/2025/06/several-alumni-earn-fulbright-awards/", label: "Fulbright Taiwan" },
  { href: "https://artsci.washu.edu/ampersand/isaac-seiler-setting-his-sights-high", label: "Ampersand profile" },
];

export default function HeroPressPills() {
  return (
    <div className="flex flex-wrap gap-3">
      {PILLS.map((p) => (
        <CardMotion key={p.href} maxTiltDeg={5} scale={1.02} className="rounded-full">
          <a
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="card-hover inline-block rounded-full border border-subtle bg-card px-3 py-1 text-sm transition-colors hover:border-[color:var(--color-accent)]/60"
          >
            {p.label}
          </a>
        </CardMotion>
      ))}
    </div>
  );
}
