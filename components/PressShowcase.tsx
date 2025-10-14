// components/PressShowcase.tsx — FULL REPLACEMENT
"use client";

import Reveal from "@/components/Reveal";
import CursorTilt from "@/components/CursorTilt";

type Press = { name: string; href: string };

const PRESS: Press[] = [
  { name: "Isaac featured in launch of ChatGPT Pulse", href: "https://openai.com/index/introducing-chatgpt-pulse/" },
  { name: "Isaac on OpenAI’s social media discussing uses of ChatGPT Study Mode", href: "https://www.instagram.com/reel/DNyG5VvXEZM/?hl=en" },
  { name: "Isaac Seiler becomes Rhodes Scholar finalist", href: "https://source.washu.edu/2024/11/seniors-darden-seiler-were-rhodes-scholars-finalists/" },
  { name: "Isaac Seiler awarded the Truman Scholarship", href: "https://artsci.washu.edu/ampersand/junior-seiler-awarded-truman-scholarship" },
  { name: "Isaac wins a Fulbright Scholarship to Taiwan", href: "https://source.washu.edu/2025/06/several-alumni-earn-fulbright-awards/" },
  { name: "Isaac’s profile by Washington University", href: "https://artsci.washu.edu/ampersand/isaac-seiler-setting-his-sights-high" },
];

export default function PressShowcase() {
  return (
    <section className="pb-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-4">
          <h2 className="text-xl">in the news</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {PRESS.map((p, i) => (
            <Reveal key={p.href} delay={i * 0.06}>
              <CursorTilt className="h-full">
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={p.name}
                  className="card-hover block h-full overflow-hidden rounded-xl border border-subtle bg-card p-5 transition-colors hover:border-[color:var(--color-accent)]/60"
                >
                  <div className="flex h-full items-center">
                    <span className="text-base text-[color:var(--color-fg)]/90">
                      {p.name}
                    </span>
                  </div>
                </a>
              </CursorTilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
