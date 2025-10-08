// components/Nav.tsx — FULL REPLACEMENT (fogged/tinted glass header)
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeLogo from "@/components/ThemeLogo";

const MotionSpan = motion.span;

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

export function Nav() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const linkedin = process.env.NEXT_PUBLIC_LINKEDIN_URL || "#";
  const linkHover = { y: -1, transition: { duration: 0.12, ease: [0.2, 0, 0, 1] } };

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

  // thematic tint for fogged glass
  const tint =
    theme === "light"
      ? "color-mix(in srgb, var(--color-bg) 70%, transparent)" // light: milkier
      : "color-mix(in srgb, var(--color-bg) 55%, transparent)"; // dark: slightly clearer

  // SVG noise data URI (very subtle)
  const noise =
    "url('data:image/svg+xml;utf8,\
<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"160\" height=\"160\" viewBox=\"0 0 160 160\">\
<filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"2\" stitchTiles=\"stitch\"/></filter>\
<rect width=\"160\" height=\"160\" filter=\"url(%23n)\" opacity=\"0.035\"/>\
</svg>')";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* fogged/tinted glass overlay */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            // heavy blur to obscure underlying text/images
            backdropFilter: "blur(22px) saturate(160%)",
            WebkitBackdropFilter: "blur(22px) saturate(160%)",
            // tint to ensure contrast and readability
            background: `
              ${tint},
              radial-gradient(120% 120% at 10% -20%, rgba(14,165,233,0.10), transparent 60%),
              radial-gradient(100% 80% at 90% -10%, rgba(255,255,255,0.08), transparent 60%)
            `,
            // subtle noise grain to sell the glass effect
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

          <div className="md:hidden flex items-center gap-2">
            <button
              className="rounded-xl border border-subtle p-2"
              aria-label="toggle menu"
              aria-expanded={open}
              onClick={() => setOpen(v => !v)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* mobile drawer */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
              className="relative md:hidden overflow-hidden"
            >
              <div className="mx-auto max-w-5xl px-4 py-4">
                <NavLinks />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* spacer to offset header height */}
      <div aria-hidden className="h-[72px] md:h-[84px]" />
    </>
  );
}
