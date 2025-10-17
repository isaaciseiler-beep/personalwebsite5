"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";

type Props = {
  // original content API
  lines: string[]; // pass your three lines
  images?: string[]; // optional array of image URLs

  // legacy image API (still used in app/page.tsx)
  imageName?: string;
  imageBaseUrl?: string;
};

export default function PinnedAbout({ lines, images, imageName, imageBaseUrl }: Props) {
  const prefers = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  // derive final images list, supporting legacy props
  const derivedImages: string[] = (() => {
    if (images && images.length) return images;
    if (imageBaseUrl && imageName) {
      const base = imageBaseUrl.replace(/\/$/, "");
      const url = `${base}/${imageName}`;
      // keep three slots so crossfade logic remains stable
      return [url, url, url];
    }
    return [];
  })();

  // repo-original scroll-proportional highlighting (no typewriter)
  useEffect(() => {
    if (prefers) return;
    let raf = 0;
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight);
      const prog = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / total));
      const bucket = prog < 1 / 3 ? 0 : prog < 2 / 3 ? 1 : 2;
      setIdx(Math.min(bucket, Math.max(0, lines.length - 1)));
    };
    const loop = () => {
      onScroll();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [prefers, lines.length]);

  return (
    <section id="about" className="relative mx-auto mt-6 max-w-6xl px-4">
      <div ref={ref} className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* left: list, emphasizes active line */}
        <div className="md:col-span-2 md:sticky md:top-[84px]">
          <h2 className="mb-4 text-sm tracking-wide text-muted">about</h2>
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

        {/* right: image column (33%), crossfades with index; hover zoom stays confined */}
        <div className="group relative h-[320px] overflow-hidden rounded-xl border border-subtle bg-card md:h-[500px]">
          {derivedImages.map((src, i) => (
            <Image
              key={`${src}-${i}`}
              src={src}
              alt={`about ${i + 1}`}
              fill
              sizes="(min-width:768px) 33vw, 100vw"
              priority={i === 0}
              className={`object-cover transition-opacity duration-300 ${i === idx ? "opacity-100" : "opacity-0"} group-hover:scale-[1.04]`}
            />
          ))}
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
        </div>
      </div>
    </section>
  );
}
