"use client";

import { useEffect, useRef, useState } from "react";
import { Github, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

type Props = { repoUrl: string; gitUrl: string; stars: number | null; shortSha: string };

export default function FooterReveal({ repoUrl, gitUrl, stars, shortSha }: Props) {
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const compactStars =
    typeof stars === "number" ? new Intl.NumberFormat("en-US", { notation: "compact" }).format(stars) : "—";

  // Close on scroll
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      if (open && Math.abs(y - lastY.current) > 2) setOpen(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative ml-auto" data-no-fx>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Open build and repo info"
        className={clsx(
          "inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)]",
          "bg-[var(--color-card)] p-2 text-sm shadow-md"
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
          <>
            {/* Backdrop shadow behind the pop-up; click to close */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black"
              onClick={() => setOpen(false)}
              data-no-fx
              aria-hidden
            />
            {/* Pop-up (solid) expanding upward */}
            <motion.div
              key="popover"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 240, damping: 24 }}
              className={clsx(
                "absolute right-0 bottom-full z-50 mb-2 w-[min(92vw,560px)] overflow-hidden",
                "rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-2xl"
              )}
              role="dialog"
              aria-modal="true"
              style={{ transformOrigin: "bottom right" }}
            >
              <motion.div
                className="h-1 w-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ type: "spring", stiffness: 210, damping: 18 }}
                style={{
                  transformOrigin: "right",
                  background: "linear-gradient(90deg, transparent, var(--color-accent))",
                }}
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
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
