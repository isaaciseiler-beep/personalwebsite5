// components/Nav.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import ThemeLogo from "@/components/ThemeLogo";

export function Nav() {
  const [open, setOpen] = useState(false);
  const linkedin = process.env.NEXT_PUBLIC_LINKEDIN_URL || "#";

  // scroll dynamics: shrink + elevate on scroll, hide a bit on fast downward scroll
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 80], [0.4, 0.75]);
  const paddingY = useTransform(scrollY, [0, 80], [24, 16]); // py-6 -> py-4
  const borderAlpha = useTransform(scrollY, [0, 80], [0.08, 0.14]);
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const dy = y - lastY;
    setLastY(y);
    if (y < 10) return setHidden(false);
    // hide when scrolling down fast, show when up
    if (dy > 6) setHidden(true);
    else if (dy < -6) setHidden(false);
  });

  const NavLinks = () => (
    <ul className="flex flex-col md:flex-row gap-6 md:gap-4 items-start md:items-center">
      <li><Link href="/about" className="link-underline hover:text-[color:var(--color-accent)]" prefetch>about</Link></li>
      <li><Link href="/work" className="link-underline hover:text-[color:var(--color-accent)]" prefetch>work</Link></li>
      <li>
        <a href={linkedin} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-[color:var(--color-accent)]" aria-label="linkedin">
          linkedin
        </a>
      </li>
    </ul>
  );

  return (
    <motion.header
      className="sticky top-0 z-50"
      initial={false}
      animate={{ y: hidden ? -18 : 0 }}
      transition={{ type: "tween", duration: 0.18, ease: [0.2, 0, 0, 1] }}
      style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
    >
      {/* background layer with dynamic opacity */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: "var(--color-bg)", opacity: bgOpacity }}
      />

      {/* bottom fade instead of line */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-6"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0), var(--color-bg))" }}
      />

      {/* content row */}
      <motion.div
        className="relative mx-auto max-w-5xl flex items-center justify-between px-4"
        style={{ paddingTop: paddingY, paddingBottom: paddingY, borderBottom: "1px solid", borderColor: `rgba(255,255,255,${0})` }}
      >
        {/* subtle dynamic border color */}
        <motion.div
          aria-hidden
          className="absolute left-0 right-0 bottom-0 h-px"
          style={{ backgroundColor: `rgba(255,255,255,1)`, opacity: borderAlpha }}
        />

        <a href="#content" className="skip-link">skip to content</a>

        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-lg" prefetch>
          <ThemeLogo size={42} />
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
            onClick={() => setOpen(v => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.div>

      {/* animated mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
            className="md:hidden overflow-hidden"
          >
            <div className="mx-auto max-w-5xl px-4 py-4 border-b border-subtle">
              <NavLinks />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
