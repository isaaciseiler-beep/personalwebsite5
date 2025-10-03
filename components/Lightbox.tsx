// components/Lightbox.tsx — FULL REPLACEMENT
// no zoom (object-contain), freeze scroll, show caption, add filmstrip
"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";

type Item = { src: string; alt: string; caption?: string };

export function Lightbox({
  open,
  items,
  index,
  setIndex,
  onClose
}: {
  open: boolean;
  items: Item[];
  index: number;
  setIndex: (i: number) => void;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const prefers = useReducedMotion();

  // lock scroll
  useEffect(() => {
    setMounted(true);
    if (!open) return;
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [open]);

  // esc + arrows
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((index + 1) % items.length);
      if (e.key === "ArrowLeft") setIndex((index - 1 + items.length) % items.length);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, index, items.length, onClose, setIndex]);

  if (!mounted || !open || items.length === 0) return null;
  const current = items[index];

  return createPortal(
    <m.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      initial={prefers ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <m.div
        onClick={(e) => e.stopPropagation()}
        initial={prefers ? { scale: 1, opacity: 1 } : { scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: prefers ? "tween" : "spring", stiffness: 220, damping: 26, duration: 0.16 }}
        className="relative max-h-[90vh] max-w-[92vw]"
      >
        <Image
          src={current.src}
          alt={current.alt}
          width={1600}
          height={1200}
          className="h-auto w-auto max-h-[70vh] max-w-[92vw] rounded-xl border border-subtle object-contain"
          priority
        />
        {current.caption && (
          <div className="mt-2 text-center text-sm text-muted">{current.caption}</div>
        )}

        {/* filmstrip */}
        {items.length > 1 && (
          <div className="mt-3 flex max-w-[92vw] gap-2 overflow-x-auto">
            {items.map((it, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`go to ${i + 1}`}
                className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-md border ${
                  i === index ? "border-[color:var(--color-accent)]/60" : "border-subtle"
                }`}
              >
                <Image src={it.src} alt={it.alt} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* controls */}
        <button
          onClick={onClose}
          aria-label="close"
          className="absolute right-2 top-2 rounded-md border border-subtle bg-[color:var(--color-bg)]/60 px-2 py-1 backdrop-blur"
        >
          ×
        </button>
        {items.length > 1 && (
          <>
            <button
              onClick={() => setIndex((index - 1 + items.length) % items.length)}
              aria-label="prev"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-md border border-subtle bg-[color:var(--color-bg)]/60 px-2 py-1 backdrop-blur"
            >
              ←
            </button>
            <button
              onClick={() => setIndex((index + 1) % items.length)}
              aria-label="next"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-subtle bg-[color:var(--color-bg)]/60 px-2 py-1 backdrop-blur"
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
