// components/Lightbox.tsx — FULL REPLACEMENT (no zoom, lock scroll, show caption)
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

  // lock scroll while open
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
      initial={prefers ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
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
          className="h-auto w-auto max-h-[80vh] max-w-[92vw] rounded-xl border border-subtle object-contain"
          priority
        />
        {/* caption / location */}
        {current.caption && (
          <div className="mt-2 text-center text-sm text-muted">{current.caption}</div>
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
