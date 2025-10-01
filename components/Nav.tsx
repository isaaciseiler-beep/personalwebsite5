"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Nav() {
  const [open, setOpen] = useState(false);
  const linkedin = process.env.NEXT_PUBLIC_LINKEDIN_URL || "#";

  const NavLinks = () => (
    <ul className="flex flex-col md:flex-row gap-6 md:gap-4 items-start md:items-center">
      <li>
        <Link href="/about" className="link-underline hover:text-accent">
          about
        </Link>
      </li>
      <li>
        <Link href="/work" className="link-underline hover:text-accent">
          work
        </Link>
      </li>
      <li>
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline hover:text-accent"
          aria-label="linkedin"
        >
          linkedin
        </a>
      </li>
    </ul>
  );

  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-black via-black/95 to-black backdrop-blur">
      <div className="mx-auto max-w-5xl flex items-center justify-between border-b border-subtle py-4 px-4">
        {/* logo with fallback text for screen readers */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight text-lg"
        >
          <Image
            src="/logo.png"
            alt="isaac logo"
            width={28}
            height={28}
            className="rounded-full"
          />
          <span className="sr-only">isaac</span>
        </Link>

        <nav className="hidden md:block">
          <NavLinks />
        </nav>

        <button
          className="md:hidden rounded-xl border border-subtle p-2"
          aria-label="toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* animated mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            className="md:hidden border-b border-subtle overflow-hidden"
          >
            <div className="py-4 px-4">
              <NavLinks />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

