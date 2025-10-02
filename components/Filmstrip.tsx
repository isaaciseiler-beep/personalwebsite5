// components/Filmstrip.tsx — FULL FILE
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

type Item = { src: string; alt: string; kind: "photo" | "video" };

type Props = {
  items: Item[];
  onOpen: (index: number) => void;
};

export default function Filmstrip({ items, onOpen }: Props) {
  const prefers = useReducedMotion();
  const scroller = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (prefers) return;
    let raf = 0;
    const step = () => {
      const el = scroller.current;
      if (!el || paused) return (raf = requestAnimationFrame(step));
      el.scrollLeft += 0.5; // gentle drift
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
        el.scrollLeft = 0; // loop
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused, prefers]);

  return (
    <div className="mt-8">
      <h2 className="text-xl mb-4">spotlight</h2>
      <div
        ref={scroller}
        className="filmstrip flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        {items.map((it, i) => (
          <button
            key={i}
            className="group relative h-[220px] w-[360px] flex-shrink-0 snap-center overflow-hidden rounded-xl border border-subtle bg-card"
            onClick={() => onOpen(i)}
            aria-label={`open ${it.alt}`}
          >
            {it.kind === "video" ? (
              <video
                className="h-full w-full object-cover"
                src={it.src}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <Image
                src={it.src}
                alt={it.alt}
                width={720}
                height={440}
                className="h-full w-full object-cover"
                loading="lazy"
                sizes="360px"
              />
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
              <div className="mx-2 mb-2 rounded-lg bg-[color:var(--color-bg)]/60 px-3 py-1 text-sm backdrop-blur">
                {it.alt}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
