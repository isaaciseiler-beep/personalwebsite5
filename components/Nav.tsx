// components/Nav.tsx — FULL REPLACEMENT
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import ThemeLogo from "@/components/ThemeLogo";
import projects from "@/data/projects.json";
import type { Project } from "@/types/project";

const ease = cubicBezier(0.2, 0, 0, 1);

function useTheme(): "dark" | "light" {
  const [t, setT] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const el = document.documentElement;
    const set = () => setT(el.getAttribute("data-theme") === "light" ? "light" : "dark");
    set();
    const obs = new MutationObserver(set);
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return t;
}

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const theme = useTheme();
  const router = useRouter();

  // dataset for client search
  const all = projects as Project[];
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    const tags = (p: Project) => (Array.isArray((p as any).tags) ? (p as any).tags.join(" ") : "");
    return all
      .filter((p) =>
        [p.title, p.location, p.summary, (p as any)?.description ?? "", tags(p)]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(s),
      )
      .slice(0, 8);
  }, [q, all]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const metaK = e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey);
      if (metaK || e.key === "/") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // click outside to close
  const popRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!searchOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!popRef.current) return;
      if (!popRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [searchOpen]);

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const term = q.trim();
    setSearchOpen(false);
    if (!term) return;
    router.push(`/work?query=${encodeURIComponent(term)}`);
  };

  // header glass
  const tint =
    theme === "light"
      ? "color-mix(in srgb, var(--color-bg) 70%, transparent)"
      : "color-mix(in srgb, var(--color-bg) 55%, transparent)";

  const noise =
    "url('data:image/svg+xml;utf8,\
<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"160\" height=\"160\" viewBox=\"0 0 160 160\">\
<filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"2\" stitchTiles=\"stitch\"/></filter>\
<rect width=\"160\" height=\"160\" filter=\"url(%23n)\" opacity=\"0.035\"/>\
</svg>')";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            background:
              `radial-gradient(1200px 1200px at 20% -40%, ${tint} 0%, transparent 54%),` +
              `linear-gradient(${tint}, ${tint})`,
            backgroundImage: `${noise}`,
            backgroundBlendMode: "overlay, normal, normal, normal",
            borderBottom: "1px solid var(--color-border)",
            boxShadow: "0 10px 28px rgba(0,0,0,0.18)",
          }}
        />

        <div className="relative mx-auto flex max-w-5xl items-center px-4 py-6">
          {/* left: logo */}
          <Link href="/" prefetch className="flex items-center gap-2 font-semibold tracking-tight text-lg">
            <motion.div whileHover={{ scale: 1.02, rotate: 2 }} whileTap={{ scale: 0.98 }}>
              <ThemeLogo size={42} />
            </motion.div>
            <span className="sr-only">isaac</span>
          </Link>

          {/* right cluster */}
          <nav className="ml-auto hidden md:flex items-center gap-6">
            <NavLinks />
            <SearchButton
              open={searchOpen}
              onOpen={() => setSearchOpen(true)}
              q={q}
              setQ={setQ}
              onSubmit={onSubmit}
              results={results}
              popRef={popRef}
            />
          </nav>

          {/* mobile */}
          <div className="ml-auto md:hidden flex items-center gap-2">
            <button
              type="button"
              className="rounded-xl border border-subtle p-2"
              aria-label="toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* mobile drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16, ease }}
              className="md:hidden border-t border-subtle bg-card/80 backdrop-blur-sm"
            >
              <div className="mx-auto max-w-5xl px-4 py-4">
                <NavLinks />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* spacer */}
      <div aria-hidden className="h-[72px] md:h-[84px]" />
    </>
  );
}

/* ---------- Subcomponents ---------- */

function NavLinks() {
  // monochrome, aggressive hover: shimmering underline + skew lift
  const Item = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      prefetch
      className="relative text-sm text-[color:var(--color-fg)]/85"
    >
      <span className="group inline-block will-change-transform transition-transform duration-150 ease-[cubic-bezier(.2,0,0,1)] group-hover:-translate-y-0.5 group-hover:skew-x-[1deg]">
        {/* shimmer mask */}
        <span className="relative">
          <span className="relative z-10">{label}</span>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -bottom-1 h-[1.5px] overflow-hidden"
          >
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
      <li>
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="relative text-sm text-[color:var(--color-fg)]/85"
          aria-label="linkedin"
        >
          <span className="group inline-block will-change-transform transition-transform duration-150 ease-[cubic-bezier(.2,0,0,1)] group-hover:-translate-y-0.5 group-hover:skew-x-[1deg]">
            <span className="relative z-10">linkedin</span>
            <span aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-1 h-[1.5px] overflow-hidden">
              <span className="block h-full w-full origin-left scale-x-0 bg-white/70 transition-transform duration-200 ease-[cubic-bezier(.2,0,0,1)] group-hover:scale-x-100" />
              <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(120deg,transparent,white,transparent)] opacity-80 transition duration-300 group-hover:translate-x-0" />
            </span>
          </span>
        </a>
      </li>
    </ul>
  );
}

function SearchButton({
  open,
  onOpen,
  q,
  setQ,
  onSubmit,
  results,
  popRef,
}: {
  open: boolean;
  onOpen: () => void;
  q: string;
  setQ: (v: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  results: Project[];
  popRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className="relative">
      {/* trigger */}
      <button
        type="button"
        aria-label="open search"
        onClick={onOpen}
        className="group flex items-center gap-2 rounded-xl border border-subtle px-3 py-2 hover:bg-[color:var(--color-muted)]"
      >
        <Search size={18} />
        <span className="rounded-md border border-subtle px-1.5 py-0.5 text-[10px] text-muted group-hover:text-[color:var(--color-fg)]/90">
          ⌘K
        </span>
      </button>

      {/* anchored popover at right, ~25% width */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={popRef}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease }}
            className="absolute right-0 mt-2 w-[min(360px,25vw)] overflow-hidden rounded-2xl border border-subtle bg-card shadow-xl"
          >
            <form onSubmit={onSubmit} className="flex items-center gap-2 px-3 py-2">
              <Search size={16} aria-hidden />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search projects and photos…"
                className="w-full bg-transparent text-base outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 caret-white placeholder:text-muted-foreground"
                autoFocus
              />
              <button
                type="submit"
                className="rounded-lg border border-subtle px-2.5 py-1 text-xs hover:bg-[color:var(--color-muted)]"
              >
                Search
              </button>
            </form>

            {/* results list */}
            <div className="border-t border-subtle">
              <AnimatePresence initial={false}>
                {results.length === 0 ? (
                  <div className="px-3 py-3 text-sm text-muted">Type to search…</div>
                ) : (
                  results.map((p, i) => (
                    <motion.a
                      key={p.slug}
                      href={p.kind === "photo" ? "/work/photos" : `/work/projects#${p.slug}`}
                      target={p.kind === "photo" ? "_self" : "_self"}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.12, ease, delay: i * 0.015 }}
                      className="block px-3 py-2 text-sm hover:bg-[color:var(--color-muted)]/50"
                    >
                      <span className="text-[color:var(--color-fg)]/90">{p.title}</span>
                      <span className="ml-2 text-xs text-muted">• {p.kind}</span>
                    </motion.a>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
