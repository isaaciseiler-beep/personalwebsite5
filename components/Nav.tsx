// components/Nav.tsx — FULL REPLACEMENT (type-safe easing)
"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import ThemeLogo from "@/components/ThemeLogo";

const MotionSpan = motion.span;
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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const theme = useTheme();
  const router = useRouter();
  const linkedin = process.env.NEXT_PUBLIC_LINKEDIN_URL || "#";

  const linkHover = { y: -1, transition: { duration: 0.12, ease } };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const metaK = e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey);
      const slash = e.key === "/";
      if (metaK || slash) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 10);
  }, [searchOpen]);

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const term = q.trim();
    setSearchOpen(false);
    if (!term) return;
    router.push(`/work?query=${encodeURIComponent(term)}`);
  };

  const NavLinks = () => (
    <ul className="flex flex-col md:flex-row gap-6 md:gap-4 items-start md:items-center">
      <li>
        <Link href="/experience" prefetch className="link-underline hover:text-[color:var(--color-accent)]">
          <MotionSpan whileHover={linkHover}>experience</MotionSpan>
        </Link>
      </li>
      <li>
        <Link href="/work" prefetch className="link-underline hover:text-[color:var(--color-accent)]">
          <MotionSpan whileHover={linkHover}>work</MotionSpan>
        </Link>
      </li>
      <li>
        <Link href="/about" prefetch className="link-underline hover:text-[color:var(--color-accent)]">
          <MotionSpan whileHover={linkHover}>about</MotionSpan>
        </Link>
      </li>
      <li>
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline hover:text-[color:var(--color-accent)]"
          aria-label="linkedin"
        >
          <MotionSpan whileHover={linkHover}>linkedin</MotionSpan>
        </a>
      </li>
    </ul>
  );

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

        <div className="relative mx-auto max-w-5xl flex items-center justify-between px-4 py-6">
          <a href="#content" className="skip-link">skip to content</a>

          <Link href="/" prefetch className="flex items-center gap-2 font-semibold tracking-tight text-lg">
            <motion.div whileHover={{ scale: 1.02, rotate: 2 }} whileTap={{ scale: 0.98 }}>
              <ThemeLogo size={42} />
            </motion.div>
            <span className="sr-only">isaac</span>
          </Link>

          <nav className="hidden md:flex items-center gap-4">
            <NavLinks />
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-xl border border-subtle p-2 hover:bg-[color:var(--color-muted)]"
              aria-label="open search"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={18} />
            </button>

            <button
              type="button"
              className="md:hidden rounded-xl border border-subtle p-2"
              aria-label="toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(v => !v)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

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

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[color:var(--color-bg)/.6] backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          >
            <motion.form
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.15, ease }}
              className="mx-auto mt-28 w-full max-w-xl"
              onSubmit={onSubmit}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center rounded-2xl border border-subtle bg-card px-3 py-2 shadow-lg">
                <Search size={18} className="mr-2" aria-hidden />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search projects and photos…  ( /  or  ⌘K )"
                  className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
                  name="q"
                  aria-label="search query"
                />
                <button
                  type="submit"
                  className="ml-2 rounded-lg border border-subtle px-3 py-1 text-sm hover:bg-[color:var(--color-muted)]"
                >
                  Search
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <div aria-hidden className="h-[72px] md:h-[84px]" />
    </>
  );
}
