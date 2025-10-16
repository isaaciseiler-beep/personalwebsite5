"use client";

import { useEffect, useRef, useState } from "react";
import { Github, X, ExternalLink } from "lucide-react";
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
  const [easter, setEaster] = useState(false);
  const holdTimer = useRef<number | null>(null);

  const compactStars =
    typeof stars === "number"
      ? new Intl.NumberFormat("en-US", { notation: "compact" }).format(stars)
      : "—";

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      // Easter egg: press G I T quickly
      if (["g", "i", "t"].includes(e.key.toLowerCase())) {
        // simple toggle when sequence typed within short window
        setEaster((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Long-press on the button toggles easter egg
  const startHold = () => {
    clearTimeout(holdTimer.current ?? undefined);
    holdTimer.current = window.setTimeout(() => setEaster((v) => !v), 650);
  };
  const endHold = () => {
    clearTimeout(holdTimer.current ?? undefined);
    holdTimer.current = null;
  };

  return (
    <div className="relative ml-auto">
      {/* Trigger */}
      <button
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Open build and repo info"
        className={clsx(
          "group inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)]",
          "bg-[var(--color-card)] p-2 text-sm"
        )}
      >
        <Github className="h-5 w-5" aria-hidden />
        <span className="sr-only">GitHub</span>
        <span className="rounded-md border border-[var(--color-border)] px-1.5 py-0.5 text-xs tabular-nums">
          {compactStars}★
        </span>
        <code className="rounded-md bg-black/20 px-1.5 py-0.5 text-xs">{shortSha}</code>
      </button>

      {/* Popover */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="popover"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 6 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="absolute right-0 z-50 mt-2 w-[min(92vw,560px)] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-xl"
            role="dialog"
            aria-modal="true"
          >
            {/* Artsy Easter Egg layer */}
            <div className="relative">
              <div
                className={clsx(
                  "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500",
                  easter && "opacity-100"
                )}
                aria-hidden
              >
                {/* Animated SVG noise + orbits */}
                <svg className="h-full w-full" viewBox="0 0 800 260" preserveAspectRatio="none">
                  <defs>
                    <filter id="noize">
                      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="7">
                        <animate attributeName="seed" from="1" to="100" dur="12s" repeatCount="indefinite" />
                      </feTurbulence>
                      <feColorMatrix type="saturate" values="0.8" />
                    </filter>
                    <radialGradient id="orb" cx="50%" cy="50%" r="60%">
                      <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                  </defs>
                  <rect width="100%" height="100%" filter="url(#noize)" opacity="0.15" />
                  {Array.from({ length: 7 }).map((_, i) => (
                    <g key={i}>
                      <circle
                        cx={400}
                        cy={130}
                        r={40 + i * 20}
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeDasharray="2 6"
                      >
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          from={`0 400 130`}
                          to={`${i % 2 ? "-" : ""}360 400 130`}
                          dur={`${8 + i * 1.5}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle r="22" fill="url(#orb)">
                        <animateMotion
                          dur={`${7 + i * 1.2}s`}
                          repeatCount="indefinite"
                          path={`M ${400 - (40 + i * 20)} 130 a ${40 + i * 20},${40 + i * 20} 0 1,1 ${
                            2 * (40 + i * 20)
                          },0 a ${40 + i * 20},${40 + i * 20} 0 1,1 ${-2 * (40 + i * 20)},0`}
                        />
                      </circle>
                    </g>
                  ))}
                </svg>
              </div>

              {/* Content */}
              <div className="relative z-10 p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                    <span>Built with</span>
                    <ul className="flex flex-wrap items-center gap-1.5">
                      <li className="rounded border border-[var(--color-border)] px-2 py-0.5">Next.js</li>
                      <li className="rounded border border-[var(--color-border)] px-2 py-0.5">Tailwind</li>
                      <li className="rounded border border-[var(--color-border)] px-2 py-0.5">Framer Motion</li>
                      <li className="rounded border border-[var(--color-border)] px-2 py-0.5">Vercel</li>
                      <li className="rounded border border-[var(--color-border)] px-2 py-0.5">Cloudflare R2</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
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

                {/* Easter egg hint */}
                <div className="mt-3 text-xs text-[var(--color-muted)]">
                  Tip: long-press or type <kbd className="rounded border px-1">g</kbd>
                  <kbd className="ml-1 rounded border px-1">i</kbd>
                  <kbd className="ml-1 rounded border px-1">t</kbd> to toggle art mode.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
