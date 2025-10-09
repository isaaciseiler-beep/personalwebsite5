// components/Nav.tsx — FULL FILE REPLACEMENT (roomier + shrink-on-scroll + better underline)
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

function normalize(p: string) {
  if (!p) return "/";
  const q = p.endsWith("/") && p !== "/" ? p.slice(0, -1) : p;
  return q;
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

function useCmdK(toggle: () => void, closeAll: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape") closeAll();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggle, closeAll]);
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

  // page progress
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

  useCmdK(() => setCmdkOpen((v) => !v), () => { setCmdkOpen(false); setOpen(false); });

  useEffect(() => {
    const region = announceRef.current;
    if (!region) return;
    const label = NAV_LINKS.find(l => normalize(l.href) === pathname)?.label ?? "page";
    region.textContent = `Navigated to ${label}`;
  }, [pathname]);

  const isActive = useMemo(() => {
    return (href: string) => {
      const h = normalize(href);
      return h === "/"
        ? pathname === "/"
        : pathname === h || pathname.startsWith(h + "/");
    };
  }, [pathname]);

  // CSS vars for height + logo scale
  const navH = scrolled ? 62 : 80; // more room, then shrink a bit
  const logoScale = scrolled ? 0.92 : 1;

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
          "bg-transparent",                 // blur only, no tint
          "transition-[height,transform] duration-200",
        ].join(" ")}
        style={{ height: navH }}
        aria-label="Main"
      >
        {/* progress */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5" aria-hidden>
          <div
            className={theme === "light" ? "h-full bg-black/40" : "h-full bg-white/40"}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* hairline */}
        <div
          className={[
            "pointer-events-none absolute inset-x-0 top-0 h-px",
            theme === "light" ? "bg-black/10" : "bg-white/10",
          ].join(" ")}
          aria-hidden
        />

        <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex h-full items-center justify-between gap-4">
            <Link href="/" className="shrink-0 focus:outline-none focus:ring">
              <motion.div
                style={{ originY: 0.5, originX: 0.5 }}
                animate={{ scale: logoScale }}
                transition={{ type: "tween", duration: 0.18 }}
              >
                <ThemeLogo />
              </motion.div>
            </Link>

            {/* desktop */}
            <div className="hidden md:flex items-center gap-2">
              {NAV_LINKS.map((l) => {
                const active = isActive(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={[
                      "group relative rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring",
                      active ? "text-current" : "text-current/80 hover:text-current",
                      "transition-[color,opacity] duration-150",
                    ].join(" ")}
                  >
                    <span>{l.label}</span>
                    {/* underline: now thicker and animated so About shows clearly */}
                    <span
                      aria-hidden
                      className={[
                        "pointer-events-none absolute left-2 right-2 -bottom-0.5 h-[2px] overflow-hidden",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "block h-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200",
                          active
                            ? theme === "light" ? "bg-black/70 scale-x-100" : "bg-white/70 scale-x-100"
                            : theme === "light" ? "bg-black/50" : "bg-white/50",
                        ].join(" ")}
                      />
                    </span>
                  </Link>
                );
              })}

              {/* quick switch */}
              <button
                onClick={() => setCmdkOpen(true)}
                className="ml-1 inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-current/80 hover:text-current focus:outline-none focus:ring pressable"
                aria-label="Open quick switcher"
              >
                <Search size={16} />
                <span className="hidden lg:inline">Quick switch</span>
                <kbd className="ml-1 rounded bg-white/10 px-1.5 text-[10px] leading-4">⌘K</kbd>
              </button>
            </div>

            {/* mobile btn */}
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 focus:outline-none focus:ring pressable"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* mobile drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: "tween", duration: 0.18 }}
              className={[
                "md:hidden supports-[backdrop-filter]:backdrop-blur-md bg-transparent",
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
                          isActive(l.href) ? "text-current" : "text-current/90",
                        ].join(" ")}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setCmdkOpen(true)}
                  className="mt-2 inline-flex w-full items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-sm text-current/90 focus:outline-none focus:ring pressable"
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

      {/* spacer matches dynamic height */}
      <div aria-hidden style={{ height: navH }} />

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
                className="block rounded-lg px-3 py-2 text-sm text-current/90 hover:text-current focus:outline-none focus:ring pressable"
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
