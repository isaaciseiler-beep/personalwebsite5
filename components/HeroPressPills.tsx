// components/HeroPressPills.tsx — FULL REPLACEMENT (retains your exact copy)
"use client";

export type Press = { name: string; href: string; logo?: string; alt?: string };

// Single source of truth used by both pills and PressRow.
export const PILLS: Press[] = [
  {
    name: "Isaac featured in launch of ChatGPT Pulse",
    href: "https://openai.com/index/introducing-chatgpt-pulse/",
  },
  {
    name: "Isaac on OpenAI’s social media discussing uses of ChatGPT Study Mode",
    href: "https://www.instagram.com/reel/DNyG5VvXEZM/?hl=en",
  },
  {
    name: "Isaac Seiler becomes Rhodes Scholar finalist",
    href: "https://source.washu.edu/2024/11/seniors-darden-seiler-were-rhodes-scholars-finalists/",
  },
  {
    name: "Isaac Seiler awarded the Truman Scholarship",
    href: "https://artsci.washu.edu/ampersand/junior-seiler-awarded-truman-scholarship",
  },
  {
    name: "Isaac wins a Fulbright Scholarship to Taiwan",
    href: "https://source.washu.edu/2025/06/several-alumni-earn-fulbright-awards/",
  },
  {
    name: "Isaac’s profile by Washington University",
    href: "https://artsci.washu.edu/ampersand/isaac-seiler-setting-his-sights-high",
  },
];

// Export for PressRow
export const pressItems: Press[] = PILLS.map(p => ({ ...p, alt: p.name }));

export default function HeroPressPills() {
  const base =
    "inline-block rounded-full border border-subtle px-3 py-1 text-sm transition-colors hover:border-[color:var(--color-accent)]/60";
  return (
    <div className="flex flex-wrap gap-3">
      {PILLS.map(p => (
        <a
          key={p.href}
          href={p.href}
          className={`card-hover ${base}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {p.name}
        </a>
      ))}
    </div>
  );
}
