"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";

type Item = { src: string; alt: string };
type Props =
  | { open: boolean; src: string | null; alt: string; onClose: () => void }                                   // backward compat
  | { open: boolean; items: Item[]; index: number; setIndex: (i: number) => void; onClose: () => void };      // carousel

export function Lightbox(props: Props) {
  const [mounted, setMounted] = useState(false);
  const prefersReduced = useReducedMotion();
  const touchX = useRef<number | null>(null);

  const isCarousel = (p: Props): p is Extract<Props, { items: Item[] }> =>
    (p as any).items && typeof (p as any).index === "number";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.onClose();
      if (isCarousel(props)) {
        if (e.key === "ArrowRight") props.setIndex((props.index + 1) % props.items.length);
        if (e.key === "ArrowLeft") props.setIndex((props.index - 1 + props.items.length) % props.items.length);
      }
    };
    if ((props as any).open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [props]);

  if (!mounted || !(props as any).open) return null;

  const current: Item | null = isCarousel(props)
    ? props.items[props.index]
    : (props as any).src
    ? { src: (props as any).src, alt: (props as any).alt }
    : null;

  if (!current) return null;

  const onTouchStart = (e: React.TouchEvent) => (touchX.current = e.changedTouches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isCarousel(props) || touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    const threshold = 40;
    if (dx < -threshold) props.setIndex((props.index + 1) % props.items.length);
    if (dx > threshold) props.setIndex((props.index - 1 + props.items.length) % props.items.length);
    touchX.current = null;
  };

  return createPortal(
    <m.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="lightbox"
      onClick={props.onClose}
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <m.div
        onClick={e => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        initial={prefersReduced ? { scale: 1, opacity: 1 } : { scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: prefersReduced ? "tween" : "spring", stiffness: 220, damping: 26, duration: 0.16 }}
        className="relative max-h-[90vh] max-w-[90vw]"
      >
        <Image
          src={current.src}
          alt={current.alt}
          width={1600}
          height={1200}
          className="h-auto w-auto max-h-[90vh] max-w-[90vw] rounded-xl border border-subtle"
        />
        <button className="absolute right-2 top-2 rounded-md bg-card px-3 py-1 text-sm" onClick={props.onClose} aria-label="close">
          close
        </button>
        {isCarousel(props) && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-md bg-card/80 px-3 py-1 text-sm"
              onClick={() => props.setIndex((props.index - 1 + props.items.length) % props.items.length)}
              aria-label="prev"
            >
              ←
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-card/80 px-3 py-1 text-sm"
              onClick={() => props.setIndex((props.index + 1) % props.items.length)}
              aria-label="next"
            >
              →
            </button>
          </>
        )}
      </m.div>
    </m.div>,
    document.body
  );
}
