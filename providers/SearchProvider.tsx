// providers/SearchProvider.tsx — FULL FILE REPLACEMENT (SSR-safe)
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Anchor = { x: number; y: number; w: number; h: number } | null;
type Item = { href: string; label: string };

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
    setAnchor({ x: rect.left, y: rect.top, w: rect.width, h: rect.height });
    setOpen(true);
  }, []);
  const openFromEl = useCallback(
    (el: Element) => openFromRect(el.getBoundingClientRect()),
    [openFromRect]
  );
  const close = useCallback(() => setOpen(false), []);

  // Optional: global event to open search
  useEffect(() => {
    const handler = (e: Event) => {
      const el = (e as CustomEvent<Element | DOMRect | undefined>).detail;
      if (el instanceof Element) openFromEl(el);
      else if (el && "x" in (el as any)) openFromRect(el as DOMRect);
      else if (typeof window !== "undefined")
        openFromRect(new DOMRect(window.innerWidth - 72, 12, 48, 40));
    };
    window.addEventListener("app:open-search", handler as any);
    return () => window.removeEventListener("app:open-search", handler as any);
  }, [openFromEl, openFromRect]);

  return (
    <SearchCtx.Provider value={{ openFromRect, openFromEl, close }}>
      {children}
      {/* SSR-safe: only portal after mount */}
      {mounted && typeof document !== "undefined" &&
        createPortal(
          <SearchOverlay open={open} anchor={anchor} onClose={close} />,
          document.body
        )}
    </SearchCtx.Provider>
  );
}

function useSiteIndex(open: boolean) {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    if (!open) return;
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"));
    const dedup = new Map<string, string>();
    links.forEach((a) => {
      const href = a.getAttribute("href") || "";
      if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;
      const label = (a.textContent || href).trim().replace(/\s+/g, " ");
      const prev = dedup.get(href);
      if (!prev || label.length > prev.length) dedup.set(href, label);
    });
    setItems(Array.from(dedup, ([href, label]) => ({ href, label })));
  }, [open]);
  return items;
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
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const items = useSiteIndex(open);

  useEffect(() => {
    if (!open) return;
    setQ("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items.slice(0, 50);
    return items
      .filter((it) => it.label.toLowerCase().includes(s) || it.href.toLowerCase().includes(s))
      .slice(0, 50);
  }, [items, q]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest?.("[data-search-surface]")) onClose();
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
      ? { x: window.innerWidth - 72, y: 12, w: 48, h: 40 }
      : { x: 0, y: 0, w: 0, h: 0 });

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
            initial={{ x: start.x, y: start.y, width: start.w, height: start.h, borderRadius: 12 }}
            animate={{ x: 0, y: 0, width: "100%", height: "100%", borderRadius: 0 }}
            exit={{ x: start.x, y: start.y, width: start.w, height: start.h, borderRadius: 12 }}
            transition={{ type: "tween", duration: 0.22 }}
            className="fixed inset-0 z-[80] p-4 sm:p-6 lg:p-8"
          >
            <div
              data-search-surface
              className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-transparent supports-[backdrop-filter]:backdrop-blur-md"
            >
              <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 21.49 21.49 20zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"
                  />
                </svg>
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search this site"
                  className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-current/50"
                />
                <kbd className="rounded bg-white/10 px-1.5 text-[10px] leading-4">Esc</kbd>
              </div>
              <ul className="max-h-[60vh] overflow-auto p-1">
                {filtered.length === 0 && (
                  <li className="px-3 py-3 text-sm text-current/60">No matches</li>
                )}
                {filtered.map((it) => (
                  <li key={`${it.href}-${it.label}`}>
                    <Link
                      href={it.href}
                      onClick={onClose}
                      className="block rounded-lg px-3 py-2 text-sm text-current/90 hover:text-current focus-visible:outline-none focus-visible:ring-0 pressable text-reactive"
                    >
                      {it.label}
                      <span className="ml-2 text-xs opacity-60">{it.href}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
