// components/Nav.tsx — FULL REPLACEMENT (card header + clipped recede stage)
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import ThemeLogo from "@/components/ThemeLogo";
import projects from "@/data/projects.json";
import type { Project } from "@/types/project";
import now from "@/data/now.json";
import { PILLS as PRESS_PILLS } from "@/components/HeroPressPills";

const ease = cubicBezier(0.2, 0, 0, 1);

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  // ------- search index (projects + now + press; photos only by location) -------
  const all = projects as Project[];
  const indexText = useMemo(() => {
    const items: Array<{ title: string; href: string; kind: string; hay: string }> = [];
    for (const p of all.filter(x => x.kind === "project")) {
      const tags = Array.isArray((p as any).tags) ? (p as any).tags.join(" ") : "";
      const desc = (p as any)?.description ?? "";
      const hay = [p.title, p.summary, p.location, tags, desc].filter(Boolean).join(" ").toLowerCase();
      items.push({ title: p.title, href: `/work/projects#${p.slug}`, kind: "project", hay });
    }
    for (const p of all.filter(x => x.kind === "photo")) {
      const loc = (p.location ?? "").toLowerCase();
      if (!loc) continue;
      items.push({ title: p.location || p.title || "photo", href: "/work/photos", kind: "photo", hay: loc });
    }
    if ((now as any)?.text) {
      const t = String((now as any).text);
      items.push({ title: t, href: "/#nowbar", kind: "now", hay: t.toLowerCase() });
    }
    for (const pill of PRESS_PILLS) {
      items.push({ title: pill.name, href: pill.href, kind: "press", hay: pill.name.toLowerCase() });
    }
    return items;
  }, [all]);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return indexText.filter(r => r.hay.includes(s)).slice(0, 8);
  }, [q, indexText]);

  // keyboard open/close + close on outside + close on scroll up
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const metaK = e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey);
      if (metaK || e.key === "/") { e.preventDefault(); setSearchOpen(true); }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const popRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!searchOpen) return;
    const onClick = (e: MouseEvent) => { if (popRef.current && !popRef.current.contains(e.target as Node)) setSearchOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [searchOpen]);
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => { const y = window.scrollY; if (y < lastY) setSearchOpen(false); lastY = y; };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Card-style header with an internal, clipped stage */}
      <header id="site-header" className="fixed top-3 left-0 right-0 z-50">
        <div className="mx-auto max-w-5xl px-4">
          <div className="rounded-2xl bg-card/80 backdrop-blur-md shadow-xl">
            {/* Recede stage sits behind the nav row and clips clones */}
            <div id="recede-stage" aria-hidden
                 className="pointer-events-none relative h-2 overflow-hidden rounded-2xl"
                 style={{ transformStyle: "preserve-3d", perspective: "900px" }} />
            <div className="flex items-center px-4 py-3">
              <Link href="/" prefetch className="flex items-center gap-2 font-semibold tracking-tight text-lg">
                <motion.div whileHover={{ scale: 1.02, rotate: 2 }} whileTap={{ scale: 0.98 }}>
                  <ThemeLogo size={38} />
                </motion.div>
                <span className="sr-only">isaac</span>
              </Link>

              <nav className="ml-auto hidden md:flex items-center gap-6">
                <NavLinks />
                <SearchCluster open={searchOpen} setOpen={setSearchOpen} q={q} setQ={setQ} results={results} popRef={popRef} />
              </nav>

              <div className="ml-auto md:hidden flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-subtle p-2"
                  aria-label="toggle menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen(v => !v)}
                >
                  {menuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16, ease }}
              className="md:hidden mx-auto max-w-5xl px-4"
            >
              <div className="mt-2 rounded-2xl bg-card/80 backdrop-blur-md shadow-xl">
                <div className="px-4 py-4"><NavLinks /></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* spacer for fixed header */}
      <div aria-hidden className="h-[82px] md:h-[88px]" />

      <RecedeController />
    </>
  );
}

/* ---------- Subcomponents ---------- */

function NavLinks() {
  const Item = ({ href, label }: { href: string; label: string }) => (
    <Link href={href} prefetch className="relative text-sm text-[color:var(--color-fg)]/85">
      <span className="group inline-block will-change-transform transition-transform duration-150 ease-[cubic-bezier(.2,0,0,1)] group-hover:-translate-y-0.5 group-hover:skew-x-[1deg]">
        <span className="relative">
          <span className="relative z-10">{label}</span>
          <span aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-1 h-[1.5px] overflow-hidden">
            <span className="block h-full w-full origin-left scale-x-0 bg-white/70 transition-transform duration-200 ease-[cubic-bezier(.2,0,0,1)] group-hover:scale-x-100" />
            <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(120deg,transparent,white,transparent)] opacity-80 transition duration-300 group-hover:translate-x-0" />
          </span>
        </span>
      </span>
    </Link>
  );
  const linkedin = process.env.NEXT_PUBLIC_LINKEDIN_URL || "#";
  return (
    <ul className="flex items-center gap-6">
      <li><Item href="/experience" label="experience" /></li>
      <li><Item href="/work" label="work" /></li>
      <li><Item href="/about" label="about" /></li>
      <li><a href={linkedin} target="_blank" rel="noopener noreferrer" className="relative text-sm text-[color:var(--color-fg)]/85">linkedin</a></li>
    </ul>
  );
}

function SearchCluster({
  open, setOpen, q, setQ, results, popRef,
}: {
  open: boolean; setOpen: (v: boolean) => void; q: string; setQ: (v: string) => void;
  results: Array<{ title: string; href: string; kind: string }>;
  popRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        aria-label="open search"
        onClick={() => setOpen(true)}
        className="group flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-[color:var(--color-muted)]"
      >
        <Search size={18} />
        <span className="rounded-md border border-subtle px-1.5 py-0.5 text-[10px] text-muted group-hover:text-[color:var(--color-fg)]/90">
          ⌘K
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={popRef}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease }}
            className="absolute right-0 mt-2 w-[min(420px,25vw)] overflow-hidden rounded-2xl shadow-xl backdrop-blur-md"
            style={{ background: "color-mix(in srgb, var(--color-bg) 55%, transparent)" }}
          >
            <div className="flex items-center gap-2 px-3 py-2">
              <Search size={16} aria-hidden />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search across site…"
                className="w-full bg-transparent text-base outline-none focus:outline-none ring-0 focus:ring-0 caret-white placeholder:text-muted-foreground"
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") { const top = results[0]; if (top) window.location.href = top.href; } }}
              />
            </div>
            <div className="h-px
