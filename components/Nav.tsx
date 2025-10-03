// components/Nav.tsx — FULL REPLACEMENT (blurred, theme-aware translucent header)
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import ThemeLogo from "@/components/ThemeLogo";

const MotionSpan = motion.span;

export function Nav() {
  const [open, setOpen] = useState(false);
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

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* glass overlay with real blur; theme-aware */}
        <div
          aria-hidden
          className="
            absolute inset-0 pointer-events-none
            bg-white/70 dark:bg-neutral-900/60
            border-b border-white/20 dark:border-white/10
            supports-[backdrop-filter]:backdrop-blur-xl
            supports-[backdrop-filter]:backdrop-saturate-150
          "
          style={{
            WebkitBackdropFilter: "blur(16px) saturate(140%)", // safari fallback
            backdropFilter: "blur(16px) saturate(140%)",
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
            <ThemeToggle />
          </nav>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="rounded-xl border border-subtle p-2"
              aria-label="toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
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
