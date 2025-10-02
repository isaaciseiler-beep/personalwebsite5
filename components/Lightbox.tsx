// components/Lightbox.tsx — FULL FILE (zoom + pan + arrows/swipe)
"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";

type Item = { src: string; alt: string };
type Props =
  | { open: boolean; src: string | null; alt: string; onClose: () => void }
  | { open: boolean; items: Item[]; index: number; setIndex: (i: number) => void; onClose: () => void };

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;

export function Lightbox(p: Props) {
  const [mounted, setMounted] = useState(false);
  const prefers = useReducedMotion();
  const touchX = useRef<number | null>(null);

  // zoom/pan state
  const [zoom, setZoom] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const drag = useRef<{ x: number; y: number } | null>(null);

  const isCarousel = (x: Props): x is Extract<Props, { items: Item[] }> =>
    (x as any).items && typeof (x as any).index === "number";

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") p.onClose();
      if (isCarousel(p)) {
        if (e.key === "ArrowRight") p.setIndex((p.index + 1) % p.items.length);
        if (e.key === "ArrowLeft") p.setIndex((p.index - 1 + p.items.length) % p.items.length);
      }
    };
    if ((p as any).open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [p]);

  useEffect(() => {
    // reset zoom on image change/open
    if ((p as any).open) {
      setZoom(1); setTx(0); setTy(0);
    }
  }, [isCarousel(p) ? p.index : (p as any).src, (p as any).open]);

  if (!mounted || !(p as any).open) return null;

  const current: Item | null = isCarousel(p)
    ? p.items[p.index]
    : (p as any).src
    ? { src: (p as any).src, alt: (p as any).alt }
    : null;

  if (!current) return null;

  const onWheel: React.WheelEventHandler = (e) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.0015;
    setZoom((z) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z + delta)));
  };

  const onMouseDown: React.MouseEventHandler = (e) => {
    if (zoom === 1) return;
    drag.current = { x: e.clientX - tx, y: e.clientY - ty };
  };
  const onMouseMove: React.MouseEventHandler = (e) => {
    if (!drag.current) return;
    setTx(e.clientX - drag.current.x);
    setTy(e.clientY - drag.current.y);
  };
  const onMouseUp = () => (drag.current = null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.changedTouches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isCarousel(p) || touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    const threshold = 40;
    if (dx < -threshold) p.setIndex((p.index + 1) % p.items.length);
    if (dx > threshold) p.setIndex((p.index - 1 + p.items.length) % p.items.length);
    touchX.current = null;
  };

  return createPortal(
    <m.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="lightbox"
      onClick={p.onClose}
      initial={prefers ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <m.div
        onClick={(e) => e.stopPropagation()}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseUp}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        initial={prefers ? { scale: 1, opacity: 1 } : { scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: prefers ? "tween" : "spring", stiffness: 220, damping: 26, duration: 0.16 }}
        className="relative max-h-[90vh] max-w-[90vw] overflow-hidden"
        style={{ cursor: zoom > 1 ? "grab" : "auto" }}
      >
        <div
          className="relative"
          style={{
            transform: `translate(${tx}px, ${ty}px) scale(${zoom})`,
            transition: drag.current ? "none" : "transform 120ms ease"
          }}
        >
          <Image
            src={current.src}
            alt={current.alt}
            width={1600}
            height={1200}
            className="h-auto w-auto max-h-[90vh] max-w-[90vw] rounded-xl border border-subtle"
            priority
          />
        </div>

        <button
          className="absolute right-2 top-2 rounded-md bg-card px-3 py-1 text-sm"
          onClick={p.onClose}
          aria-label="close"
        >
          close
        </button>

        {isCarousel(p) && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-md bg-card/80 px-3 py-1 text-sm"
              onClick={() => p.setIndex((p.index - 1 + p.items.length) % p.items.length)}
              aria-label="prev"
            >
              ←
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-card/80 px-3 py-1 text-sm"
              onClick={() => p.setIndex((p.index + 1) % p.items.length)}
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
