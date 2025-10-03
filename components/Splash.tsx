"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";

function useTheme(): "dark" | "light" {
  const [t, setT] = useState<"dark" | "light">("dark");
  useEffect(() => {
    if (typeof document === "undefined") return;
    const el = document.documentElement;
    const set = () => setT(el.getAttribute("data-theme") === "light" ? "light" : "dark");
    set();
    const obs = new MutationObserver(set);
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return t;
}

type Props = {
  preloadUrls?: string[];
  wordmarkDark?: string;
  wordmarkLight?: string;
  maxDurationMs?: number; // safety cap (default 2500)
};

export default function Splash({
  preloadUrls = [],
  wordmarkDark = "/isaacseiler-darkmode.png",
  wordmarkLight = "/isaacseiler-lightmode.png",
  maxDurationMs = 2500
}: Props) {
  const theme = useTheme();
  const prefersReduced = useReducedMotion();
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0); // 0..1
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // tween progress smoothly toward target
  const tick = () => {
    setProgress((p) => {
      const next = p + (targetRef.current - p) * 0.15; // ease toward
      if (Math.abs(next - targetRef.current) < 0.002) return targetRef.current;
      rafRef.current = requestAnimationFrame(tick);
      return next;
    });
  };

  // preload images & drive target progress
  useEffect(() => {
    if (prefersReduced) {
      // quick, respectful fade
      const id = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(id);
    }

    let done = 0;
    const urls = Array.from(new Set(preloadUrls)).filter(Boolean);
    const total = urls.length || 4; // if nothing to preload, fake 4 steps

    const step = () => {
      done += 1;
      targetRef.current = Math.min(1, done / total * 0.9 + 0.05); // up to 95%
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };

    if (urls.length) {
      urls.forEach((u) => {
        const img = new Image();
        img.onload = step;
        img.onerror = step;
        img.src = u;
      });
    } else {
      // simulate steps
      const fake = setInterval(step, 200);
      setTimeout(() => clearInterval(fake), 1000);
    }

    // safety cap: always end by maxDurationMs
    const cap = setTimeout(() => {
      targetRef.current = 1;
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
      // allow tiny delay for final animation
      setTimeout(() => setShow(false), 220);
    }, maxDurationMs);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(cap);
    };
  }, [preloadUrls, prefersReduced, maxDurationMs]);

  // allow user to skip (ESC or click)
  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShow(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [show]);

  const pct = Math.round(progress * 100);
  const wordmark = theme === "light" ? wordmarkLight : wordmarkDark;

  return (
    <AnimatePresence>
      {show && (
        <m.div
          className="fixed inset-0 z-[100] overflow-hidden"
          aria-hidden
          initial={{ opacity: 1, filter: "blur(0px)" }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: prefersReduced ? 0.2 : 0.4, ease: [0.2, 0, 0, 1] }}
          onClick={() => setShow(false)}
        >
          {/* backdrop: glassy gradient + grain */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-90"
              style={{
                background:
                  "radial-gradient(1200px 600px at 10% -10%, rgba(14,165,233,0.18), transparent 60%), radial-gradient(900px 480px at 90% 0%, rgba(255,255,255,0.10), transparent 60%)",
                filter: "blur(24px) saturate(140%)"
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.02'/></svg>\")",
                backgroundSize: "180px 180px",
              }}
            />
          </div>

          {/* center content */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center p-6">
            {/* wordmark */}
            <m.img
              src={wordmark}
              alt="isaac seiler"
              className="max-w-[70vw] md:max-w-[46vw] select-none"
              draggable={false}
              initial={{ opacity: 0, y: 6, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: prefersReduced ? 0.2 : 0.6, ease: [0.2, 0, 0, 1] }}
            />

            {/* progress bar */}
            <div className="mt-6 w-[72vw] max-w-[520px]">
              <div className="relative h-[3px] w-full overflow-hidden rounded-full border border-subtle/60 bg-[color:var(--color-bg)]/30 backdrop-blur">
                <m.div
                  className="absolute left-0 top-0 h-full"
                  style={{
                    width: `${pct}%`,
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,.6), rgba(255,255,255,.9))"
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.15 }}
                />
                {/* glow sweep */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.12) 40%, rgba(255,255,255,0) 80%)",
                    backgroundSize: "200% 100%",
                    animation: "sweep 1.4s linear infinite"
                  }}
                />
              </div>
            </div>

            {/* small instruction for skip (not visible on PRM) */}
            {!prefersReduced && (
              <div className="mt-3 text-xs text-muted">press esc or click to skip</div>
            )}
          </div>

          <style jsx global>{`
            @keyframes sweep {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `}</style>
        </m.div>
      )}
    </AnimatePresence>
  );
}
