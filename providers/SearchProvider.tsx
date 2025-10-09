"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

type Ctx = {
  open: () => void;
  close: () => void;
};

const SearchCtx = createContext<Ctx | null>(null);
export const useSearch = () => {
  const v = useContext(SearchCtx);
  if (!v) throw new Error("SearchProvider missing");
  return v;
};

export default function SearchProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  const ctx = {
    open: () => setOpen(true),
    close: () => setOpen(false),
  };

  return (
    <SearchCtx.Provider value={ctx}>
      {children}
      {mounted && typeof document !== "undefined" &&
        createPortal(<SearchOverlay open={open} onClose={ctx.close} />, document.body)}
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

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const hint = useAnimatedHint();

  useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest?.("[data-search-card]")) onClose();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] supports-[backdrop-filter]:backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Site search"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="fixed left-8 top-24 z-[80] w-[480px] rounded-2xl border border-white/10 bg-transparent supports-[backdrop-filter]:backdrop-blur-md"
            data-search-card
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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={hint}
                aria-label="Search the site"
                className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-current/60"
              />
              <kbd className="rounded bg-white/10 px-1.5 text-[10px] leading-4">Esc</kbd>
            </div>
            <div className="px-4 py-4 text-sm text-current/60">
              Type and press Enter. Press Esc to close.
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
