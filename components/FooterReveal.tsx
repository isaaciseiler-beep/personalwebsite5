"use client";

import { useEffect, useRef, useState } from "react";
import { Github, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

type Props = {
  repoUrl: string;
  gitUrl: string;
  stars: number | null;
  shortSha: string;
};

export default function FooterReveal({ repoUrl, gitUrl, stars, shortSha }: Props) {
  const [open, setOpen] = useState(false);
  const lastY = useRef<number>(0);
  const compactStars =
    typeof stars === "number"
      ? new Intl.NumberFormat("en-US", { notation: "compact" }).format(stars)
      : "—";

  // Close on scroll with fluid tuck-back
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      if (open && Math.abs(y - lastY.current) > 2) setOpen(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <div className="relative ml-auto">
      {/* Liquid morph trigger (uses shared layoutId) */}
      <motion.button
        layoutId="gitcard"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Open build and repo info"
        className={clsx(
          "inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-2 text-sm",
          "shadow-md backdrop-blur-sm"
        )}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
      >
        <Github className="h-5 w-5" aria-hidden />
        <span className="sr-only">GitHub</span>
        <span className="rounded-md border border-[var(--color-border)] px-1.5 py-0.5 text-xs tabular-nums">
          {compactStars}★
        </span>
        <code className="rounded-md bg-black/20 px-1.5 py-0.5 text-xs">{shortSha}</code>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="popover"
            layoutId="gitcard"
            initial={{ borderRadius: 12, opacity: 0.0 }}
            animate={{ borderRadius: 16, opacity: 1 }}
            exit={{ borderRadius: 12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className={clsx(
              "absolute right-0 z-50 mt-2 w-[min(92vw,560px)] overflow-hidden rounded-2xl",
              "border border-[var(--color-border)] bg-[var(--color-card)] shadow-2xl backdrop-blur-md"
            )}
            role="dialog"
            aria-modal="true"
          >
            {/* Liquid header bar */}
            <motion.div
              className="h-1 w-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ type: "spring", stiffness: 210, damping: 18 }}
              style={{ transformOrigin: "left", background: "linear-gradient(90deg,var(--color-accent),transparent)" }}
            />
            <div className="p-4 sm:p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-[var(--color-muted)]">
                <span>Built with</span>
                <ul className="flex flex-wrap items-center gap-1.5">
                  <li className="rounded border border-[var(--color-border)] px-2 py-0.5">Next.js</li>
                  <li className="rounded border border-[var(--color-border)] px-2 py-0.5">Tailwind</li>
                  <li className="rounded border border-[var(--color-border)] px-2 py-0.5">Framer Motion</li>
                  <li className="rounded border border-[var(--color-border)] px-2 py-0.5">Vercel</li>
                  <li className="rounded border border-[var(--color-border)] px-2 py-0.5">Cloudflare R2</li>
                </ul>
              </div>

              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 hover:underline"
                >
                  <Github className="h-4 w-4" />
                  <span>Repo</span>
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>
                <a
                  href={gitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 hover:underline"
                >
                  <code className="text-xs">.git</code>
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>

                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-3">
                  <div className="text-[var(--color-muted)]">Stars</div>
                  <div className="tabular-nums text-lg">{compactStars}★</div>
                </div>

                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-3">
                  <div className="text-[var(--color-muted)]">Latest commit</div>
                  <code className="rounded bg-black/20 px-1 py-0.5">{shortSha}</code>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
