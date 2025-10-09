// components/Nav.tsx — FULL FILE REPLACEMENT (exports default and named `Nav`)
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, X, Search } from "lucide-react";
import ThemeLogo from "@/components/ThemeLogo";
import { motion, AnimatePresence } from "framer-motion";

type Theme = "dark" | "light";

function useTheme(): Theme {
  const [t, setT] = useState<Theme>("dark");
  useEffect(() => {
    const el = document.documentElement;
    const read = () => setT(el.getAttribute("data-theme") === "light" ? "light" : "dark");
    read();
    const obs = new MutationObserver(read);
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return t;
}

const NAV_LINKS: Array<{ href: string; label: string; keywords?: string[] }> = [
  { href: "/", label: "Home", keywords: ["start", "landing"] },
  { href: "/experience", label: "Experience", keywords: ["work", "resume"] },
  { href: "/about", label: "About", keywords: ["bio", "me"] },
];

function Nav() {
  const theme = useTheme();
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const announceRef = useRef<HTMLDivElement>(null);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY.current;
      const preferReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (y > 16 && dy > 0) setHidden(true);
      else setHidden(false);
      lastY.current = y;

      const h = document.documentElement;
      const max = (h.scrollHeight - h.clientHeight) || 1;
      setProgress(Math.min(100, Math.max(0, (y / max) * 100)));

      if (preferReduced) setHidden(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const anyOpen = open || cmdkOpen;
    document.documentElement.style.overflow = anyOpen ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open, cmdkOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdkOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setCmdkOpen(false);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const region = announceRef.current;
    if (!region) return;
    region.textContent = `Navigated to ${NAV_LINKS.find(l => l.href === pathname)?.label ?? "page"}`;
  }, [pathname]);

  const active = useMemo(() => {
    return (href: string) =>
      href === "/"
        ? pathname === "/"
        : pathname === href || pathname.startsWith(href + "/");
  }, [pathname]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-black/80 focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <div ref={announceRef} className="sr-only" aria-live="polite" />

      <header
        className={[
          "fixed inset-x-0 top-0 z-50",
          "supports-[backdrop-filter]:backdrop-blur-md",
          "bg-transparent",
          "transition-transform duration-200 will-change-transform",
          hidden ? "-translate-y-full" : "translate-y-0",
        ].join(" ")}
        aria-label="Main"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5" aria-hidden>
          <div
            className={`h-full ${theme === "light" ? "bg-black/40" : "bg-white/40"}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div
          className={[
            "pointer-events-none absolute inset-x-0 top-0 h-px",
            theme === "light" ? "bg-black/10" : "bg-white/10",
          ].join(" ")}
          aria-hidden
        />

        <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[64px] items-center justify-between gap-4">
            <Link href="/" className="shrink-0 focus:outline-none focus:ring">
              <ThemeLogo />
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={[
                    "relative rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring",
                    "text-current/80 hover:text-current",
                    active(l.href) ? "text-current" : "",
                    "transition-[color,opacity] duration-150",
                  ].join(" ")}
                >
                  <span>{l.label}</span>
                  <span
                    aria-hidden
                    className={[
                      "absolute left-2 right-2 -bottom-0.5 h-px",
                      active(l.href) ? (theme === "light" ? "bg-black/60" : "bg-white/60") : "bg-transparent",
                      "transition-colors duration-150",
                    ].join(" ")}
                  />
                </Link>
              ))}

              <button
                onClick={() => setCmdkOpen(true)}
                className="ml-1 inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-current/80 hover:text-current focus:outline-none focus:ring"
                aria-label="Open quick switcher"
              >
                <Search size={16} />
                <span className="hidden lg:inline">Quick switch</span>
                <kbd className="ml-1 rounded bg-white/10 px-1.5 text-[10px] leading-4">⌘K</kbd>
              </button>
            </div>

            <button
              aria-label={open ? "Close menu" : "Open menu"}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 focus:outline-none focus:ring"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: "tween", duration: 0.18 }}
              className={[
                "md:hidden",
                "supports-[backdrop-filter]:backdrop-blur-md",
                "bg-transparent",
                theme === "light" ? "border-t border-black/10" : "border-t border-white/10",
              ].join(" ")}
            >
              <div className="mx-auto max-w-6xl px-4 py-3">
                <ul className="flex flex-col">
                  {NAV_LINKS.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className={[
                          "block rounded-lg px-2 py-2 text-base focus:outline-none focus:ring",
                          active(l.href) ? "text-current" : "text-current/90",
                        ].join(" ")}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setCmdkOpen(true)}
                  className="mt-2 inline-flex w-full items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-sm text-current/90 focus:outline-none focus:ring"
                >
                  <span className="flex items-center gap-2">
                    <Search size={16} />
                    Quick switch
                  </span>
                  <kbd className="rounded bg-white/10 px-1.5 text-[10px] leading-4">⌘K</kbd>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div aria-hidden className="h-[64px]" />

      <QuickSwitcher
        open={cmdkOpen}
        onClose={() => setCmdkOpen(false)}
        links={NAV_LINKS}
        theme={theme}
      />
    </>
  );
}

/** Minimal command palette using <dialog>. No tint. */
function QuickSwitcher({
  open,
  onClose,
  links,
  theme,
}: {
  open: boolean;
  onClose: () => void;
  links: Array<{ href: string; label: string; keywords?: string[] }>;
  theme: Theme;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) {
      dlg.showModal();
      requestAnimationFrame(() => inputRef.current?.focus());
    }
    if (!open && dlg.open) dlg.close();
  }, [open]);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    dlg.addEventListener("cancel", onCancel);
    return () => dlg.removeEventListener("cancel", onCancel);
  }, [onClose]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return links;
    return links.filter((l) =>
      [l.label, l.href, ...(l.keywords ?? [])].some((s) => s.toLowerCase().includes(qq))
    );
  }, [q, links]);

  return (
    <dialog
      ref={ref}
      className={[
        "m-0 w-full max-w-lg rounded-2xl p-0 outline-none",
        "supports-[backdrop-filter]:backdrop-blur-md",
        "bg-transparent",
        "open:animate-in open:fade-in-0",
      ].join(" ")}
      onClose={onClose}
    >
      <div className="rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
          <Search size={16} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type to filter…"
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-current/50"
            aria-label="Filter destinations"
          />
          <kbd className="rounded bg-white/10 px-1.5 text-[10px] leading-4">Esc</kbd>
        </div>
        <ul className="max-h-72 overflow-auto px-1 py-1">
          {filtered.length === 0 && (
            <li className="px-3 py-2 text-sm text-current/60">No matches</li>
          )}
          {filtered.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block rounded-lg px-3 py-2 text-sm text-current/90 hover:text-current focus:outline-none focus:ring"
                onClick={onClose}
              >
                {l.label}
                <span className="ml-2 text-xs opacity-60">{l.href}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  );
}

export default Nav;
export { Nav };
