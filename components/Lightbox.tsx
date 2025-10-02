"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";

type Props = { open: boolean; src: string | null; alt: string; onClose: () => void };

export function Lightbox({ open, src, alt, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const prefersReduced = useReducedMotion();
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !open || !src) return null;

  return createPortal(
    <m.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="image lightbox"
      onClick={onClose}
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <m.div
        onClick={(e) => e.stopPropagation()}
        initial={prefersReduced ? { scale: 1, opacity: 1 } : { scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: prefersReduced ? "tween" : "spring", stiffness: 220, damping: 26, duration: 0.16 }}
        className="relative max-h-[90vh] max-w-[90vw]"
      >
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={1200}
          className="h-auto w-auto max-h-[90vh] max-w-[90vw] rounded-xl border border-subtle"
        />
        <button
          className="absolute right-2 top-2 rounded-md bg-card px-3 py-1 text-sm"
          onClick={onClose}
          aria-label="close"
        >
          close
        </button>
      </m.div>
    </m.div>,
    document.body
  );
}

