// components/Nav.tsx — FULL FILE REPLACEMENT (hooks into global search + removes blue focus)
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, X, Search } from "lucide-react";
import ThemeLogo from "@/components/ThemeLogo";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "@/providers/SearchProvider";

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

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/experience", label: "Experience" },
  { href: "/about", label: "About" },
];

function normalize(p: string) {
  if (!p) return "/";
  return p.endsWith("/") && p !== "/" ? p.slice(0, -1) : p;
}

function useScrolled(threshold = 24) {
  const [scrolled, set] = useState(false);
  useEffect(() => {
    const onScroll = () => set(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

function progressPct() {
  const h = document.documentElement;
  const max = (h.scrollHeight - h.clientHeight) || 1;
  const y = window.scrollY || 0;
  return Math.min(100, Math.max(0, (y / max) * 100));
}

function Nav() {
  const theme = useTheme();
  const pathname = normalize(usePathname() || "/");
  const [open, setOpen] = useState(false);
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const scrolled = useScrolled(24);
  const announceRef = useRef<HTMLDivElement>(null);
  const search = useSearch();
  const searchBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setProgress(progressPct());
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // lock scroll if overlays open
  useEffect(() => {
    const anyOpen = open || cmdkOpen;
    document.documentElement.style.overflow = anyOpen ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open, cmdkOpen]);

  useEffect(() => {
    const region = announceRef.current;
    if (!region) return;
    const label = NAV_LINKS.find(l => normalize(l.href) === pathname)?.label ?? "page";
    region.textContent = `Navigated to ${label}`;
  }, [pathname]);

  const isActive = useMemo(() => {
    return (href: string) => {
      const h = normalize(href);
      return h === "/" ? pathname === "/" : pathname === h || pathname.startsWith(h + "/");
    };
  }, [pathname]);

  const navH = scrolled ? 62 : 80;
  const logoScale = scrolled ? 0.92 : 1;

  return (
    <>
      <a
    href="#content"
    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-black/80 focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <div ref={announceRef} className="sr-only" aria-live="polite" />

      <header
        data-no-outline
        className={[
          "fixed inset-x-0 top-0 z-50",
          "supports-[backdrop-filter]:backdrop-blur-md",
          "bg-transparent",
          "transition-[height,transform] duration-200",
        ].join(" ")}
        style={{ height: navH }}
        aria-label="Main"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5" aria-hidden>
          <div className={theme === "light" ? "h-full bg-black/40" : "h-full bg-white/40"} style={{ width: `${progress}%` }} />
        </div>

        <div className={["pointer-events-none absolute inset-x-0 top-0 h-px", theme === "light" ? "bg-black/10" : "bg-white/10"].join(" ")} aria-hidden />

        <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex h-full items-center justify-between gap-4">
            <Link href="/" className="shrink-0 focus-visible:outline-none focus-visible:ring-0 pressable text-reactive">
              <motion.div style={{ originY: 0.5, originX: 0.5 }} animate={{ scale: logoScale }} transition={{ type: "tween", duration: 0.18 }}>
                <ThemeLogo />
              </motion.div>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {NAV_LINKS.map((l) => {
                const active = isActive(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={[
                      "group relative rounded-lg px-3 py-2 text-sm font-medium pressable text-reactive",
                      "focus-visible:outline-none focus-visible:ring-0",
                      active ? "text-current" : "text-current/80 hover:text-current",
                      "transition-[color,opacity] duration-150",
                    ].join(" ")}
                  >
                    <span>{l.label}</span>
                    <span aria-hidden className="pointer-events-none absolute left-2 right-2 -bottom-0.5 h-[2px] overflow-hidden">
                      <span
                        className={[
                          "block h-full origin-left transition-transform duration-200",
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                          theme === "light" ? "bg-black/70" : "bg-white/70",
                        ].join(" ")}
                      />
                    </span>
                  </Link>
                );
              })}

          <button
            onClick={search.open}
            className="ml-1 inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-current/80 hover:text-current focus-visible:outline-none focus-visible:ring-0 pressable text-reactive"
            aria-label="Open search"
          >
            <Search size={16} />
            <span className="hidden lg:inline">Search</span>
          </button>
            </div>

            <button
              aria-label={open ? "Close menu" : "Open menu"}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 focus-visible:outline-none focus-visible:ring-0 pressable text-reactive"
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
              className={["md:hidden supports-[backdrop-filter]:backdrop-blur-md bg-transparent", theme === "light" ? "border-t border-black/10" : "border-t border-white/10"].join(" ")}
            >
              <div className="mx-auto max-w-6xl px-4 py-3">
                <ul className="flex flex-col">
                  {NAV_LINKS.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className={["block rounded-lg px-2 py-2 text-base focus-visible:outline-none focus-visible:ring-0 pressable text-reactive", isActive(l.href) ? "text-current" : "text-current/90"].join(" ")}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    setOpen(false);
                    search.openFromRect(new DOMRect(window.innerWidth - 72, 12, 48, 40));
                  }}
                  className="mt-2 inline-flex w-full items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-sm text-current/90 focus-visible:outline-none focus-visible:ring-0 pressable text-reactive"
                >
                  <span className="flex items-center gap-2">
                    <Search size={16} />
                    Search
                  </span>
                  <kbd className="rounded bg-white/10 px-1.5 text-[10px] leading-4">⌘K</kbd>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div aria-hidden style={{ height: navH }} />
    </>
  );
}

export default Nav;
export { Nav };
