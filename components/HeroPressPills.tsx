"use client";

export default function HeroPressPills() {
  // re-usable classes: .card-hover already defined in globals (adds lift/shadow)
  const base =
    "inline-block rounded-full border border-subtle px-3 py-1 text-sm transition-colors hover:border-[color:var(--color-accent)]/60";

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href="https://openai.com/index/introducing-chatgpt-pulse/"
        className={`card-hover ${base}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Isaac featured in launch of ChatGPT Pulse
      </a>
      <a
        href="https://www.instagram.com/reel/DNyG5VvXEZM/?hl=en"
        className={`card-hover ${base}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Isaac on OpenAI&rsquo;s social media discussing uses of ChatGPT Study Mode
      </a>
      <a
        href="https://source.washu.edu/2024/11/seniors-darden-seiler-were-rhodes-scholars-finalists/"
        className={`card-hover ${base}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Isaac Seiler becomes Rhodes Scholar finalist
      </a>
      <a
        href="https://artsci.washu.edu/ampersand/junior-seiler-awarded-truman-scholarship"
        className={`card-hover ${base}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Isaac Seiler awarded the Truman Scholarship
      </a>
      <a
        href="https://source.washu.edu/2025/06/several-alumni-earn-fulbright-awards/"
        className={`card-hover ${base}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Isaac wins a Fulbright Scholarship to Taiwan
      </a>
      <a
        href="https://artsci.washu.edu/ampersand/isaac-seiler-setting-his-sights-high"
        className={`card-hover ${base}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Isaac&rsquo;s profile by Washington University
      </a>
    </div>
  );
}
