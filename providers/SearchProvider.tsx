// providers/SearchProvider.tsx — FULL FILE REPLACEMENT (type-safe + left-card + dynamic text)
"use client";

import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

type Anchor =
  | { x: number; y: number; width: number; height: number }
  | null;

type Ctx = {
  openFromRect: (rect: DOMRect) => void;
  openFromEl: (el: Element) => void;
  close: () => void;
};

const SearchCtx = createContext<Ctx | null>(null);
export const useSearch = () => {
  const v = useContext(SearchCtx);
  if (!v) throw new Error("SearchProvider missing");
  return v;
};

export default function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const openFromRect = useCallback((rect: DOMRect) => {
    setAnchor({ x: rect.left, y: rect.top, width: rect.width, height: rect.height });
    setOpen(true);
  }, []);
  const openFromEl = useCallback(
    (el: Element) => openFromRect(el.getBoundingClientRect()),
    [openFromRect]
  );
  const close = useCallback(() => setOpen(false), []);

  // optional global event trigger
  useEffect(() => {
    const handler = (e: Event) => {
      const el = (e as CustomEvent<Element | DOMRect | undefined>).detail;
      if (el instanceof Element) openFromEl(el);
      else if (el && "x" in (el as any)) openFromRect(el as DOMRect);
    };
    window.addEventListener("app:open-search", handler as any);
    return () => window.removeEventListener("app:open-search", handler as any);
  }, [openFromEl, openFromRect]);

  return (
    <SearchCtx.Provider value={{ openFromRect, openFromEl, close }}>
      {children}
      {mounted && typeof document !== "undefined" &&
        createPortal(<SearchOverlay open={open} anchor={anchor} onClose={close} />, document.body)}
    </SearchCtx.Provider>
  );
}

function useAnimatedHint(text = "Search the site") {
  const [dots, setDots] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d + 1) % 4), 600);
    return () => clearInterval(id);
  }, []);
  return `${text}${".".repeat(dots)}`;
}

function SearchOverlay({
  open,
  anchor,
  onClose,
}: {
  open: boolean;
  anchor: Anchor;
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const hint = useAnimatedHint();

  useEffect(() => {
    if (!open) return;
    setQ("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  // close on outside click or Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest?.("[data-search-card]")) onClose();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open, onClose]);

  const start =
    anchor ??
    (typeof window !== "undefined"
      ? { x: window.innerWidth - 72, y: 12, width: 48, height: 40 }
      : { x: 0, y: 0, width: 0, height: 0 });

  const target = useMemo(
    () => ({
      x: 16,
      y: 96,
      width: 560,
      height: 160,
      borderRadius: 16,
    }),
    []
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* subtle blur backdrop */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] supports-[backdrop-filter]:backdrop-blur-sm"
          />

          {/* morph from button to left card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Site search"
            initial={{
              x: start.x,
              y: start.y,
              width: start.width,
              height: start.height,
              borderRadius: 12,
            }}
            animate={{
              x: target.x,
              y: target.y,
              width: target.width,
              height: target.height,
              borderRadius: target.borderRadius,
            }}
            exit={{
              x: start.x,
              y: start.y,
              width: start.width,
              height: start.height,
              borderRadius: 12,
            }}
            transition={{ type: "tween", duration: 0.22 }}
            className="fixed z-[80]"
          >
            <div
              data-search-card
              className="flex h-full flex-col rounded-2xl border border-white/10 bg-transparent supports-[backdrop-filter]:backdrop-blur-md"
            >
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 21.49 21.49 20zM9.5 14A4.5 4.5 0 1 1 14 9.5 4.505 4.505 0 0 1 9.5 14"
                  />
                </svg>
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={hint}
                  aria-label="Search the site"
                  className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-current/60"
                />
                <kbd className="rounded bg-white/10 px-1.5 text-[10px] leading-4">Esc</kbd>
              </div>

              {/* body, no suggestions */}
              <div className="flex-1 px-4 py-3 text-sm text-current/60">
                Type to search. Press Enter or Esc to close.
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
