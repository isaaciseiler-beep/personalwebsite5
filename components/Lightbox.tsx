"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Image from "next/image";

type Props = { open: boolean; src: string | null; alt: string; onClose: () => void; };

export function Lightbox({ open, src, alt, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!mounted || !open || !src) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true" aria-label="image lightbox" onClick={onClose}>
      <div className="relative max-h-[90vh] max-w-[90vw]" onClick={e => e.stopPropagation()}>
        <Image src={src} alt={alt} width={1600} height={1200} className="h-auto w-auto max-h-[90vh] max-w-[90vw] rounded-xl border border-subtle" />
        <button className="absolute right-2 top-2 rounded-md bg-card px-3 py-1 text-sm" onClick={onClose} aria-label="close">close</button>
      </div>
    </div>,
    document.body
  );
}

