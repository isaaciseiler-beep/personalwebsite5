"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";

type Item = { src: string; alt: string };
type CarouselProps = {
  open: boolean;
  items: Item[];
  index: number;
  setIndex: (i: number) => void;
  onClose: () => void;
};
type SingleProps = { open: boolean; src: string | null; alt: string; onClose: () => void };
type Props = CarouselProps | SingleProps;

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;

// type guard
function isCarouselProps(props: Props): props is CarouselProps {
  return (props as any).items && typeof (props as any).index === "number";
}

export function Lightbox(props: Props) {
  const [mounted, setMounted] = useState(false);
  const prefers = useReducedMotion();
  const touchX = useRef<number | null>(null);

  // zoom/pan state
  const [zoom, setZoom] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const drag = useRef<{ x: number; y: number } | null>(null);

  const isOpen = props.open;

  // derive current image key for reset
  const currentKey = isCarouselProps(props)
    ? `${props.index}-${props.items.length}`
    : props.src ?? "";

  useEffect(() => setMounted(true), []);

  // keyboard events
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.onClose();
      if (isCarouselProps(props)) {
        if (e.key === "ArrowRight") props.setIndex((props.index + 1) % props.items.length);
        if (e.key === "ArrowLeft") props.setIndex((props.index - 1 + props.items.length) % props.items.length);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, props]);

  // reset zoom/pan when image changes or opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setTx(0);
      setTy(0);
    }
  }, [isOpen, currentKey]);

  if (!mounted || !isOpen) return null;

  const current: Item | null = isCarouselProps(props)
    ? props.items[props.index]
    : props.src
    ? { src: props.src, alt: props.alt }
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
    if (!isCarouselProps(props) || touchX.current == null) return;
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
          onClick={props.onClose}
          aria-label="close"
        >
          close
        </button>

        {isCarouselProps(props) && (
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
