"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";

type Props = {
  lines: [string, string, string];
  images: [string, string, string];
};

export default function PinnedAbout({ lines, images }: Props) {
  const prefers = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (prefers) return;
    let raf = 0;
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const prog = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (total || 1)));
      setIdx(prog < 0.33 ? 0 : prog < 0.66 ? 1 : 2);
    };
    const loop = () => {
      onScroll();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [prefers]);

  return (
    <section id="about" className="relative mx-auto mt-6 max-w-5xl px-4">
      <div ref={ref} className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* left: list that highlights the active line */}
        <div className="md:sticky md:top-[84px]">
          <h2 className="mb-4 text-xl">about</h2>
          <ul className="space-y-3 text-muted">
            {lines.map((t, i) => (
              <li
                key={i}
                className={`transition-opacity duration-300 ${
                  i === idx ? "opacity-100 text-[color:var(--color-fg)]" : "opacity-60"
                }`}
              >
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* right: photo that crossfades with index */}
        <div className="relative h-[320px] overflow-hidden rounded-xl border border-subtle bg-card md:h-[420px]">
          {images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={`about ${i + 1}`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className={`object-cover transition-opacity duration-300 ${i === idx ? "opacity-100" : "opacity-0"}`}
              priority={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
