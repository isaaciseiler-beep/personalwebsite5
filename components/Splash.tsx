// components/Splash.tsx — FULL REPLACEMENT
// World-class splash: full-screen blur field, pulsing wordmark, real progress bar,
// no skip, dissolves to the app by un-blurring #app-root.

"use client";

import { useEffect, useRef, useState } from "react";
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
  maxDurationMs?: number;
  revealTargetId?: string; // e.g. "app-root"
};

export default function Splash({
  preloadUrls = [],
  wordmarkDark = "/isaacseiler-darkmode.png",
  wordmarkLight = "/isaacseiler-lightmode.png",
  maxDurationMs = 2400,
  revealTargetId = "app-root"
}: Props) {
  const theme = useTheme();
  const prefersReduced = useReducedMotion();
  const [visible, setVisible] = useState(true);

  const [progress, setProgress] = useState(0); // 0..1
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // smooth tween toward target
  const tick = () => {
    setProgress((p) => {
      const next = p + (targetRef.current - p) * 0.16;
      if (Math.abs(next - targetRef.current) < 0.003) return targetRef.current;
      rafRef.current = requestAnimationFrame(tick);
      return next;
    });
  };

  // preload real assets & drive bar
  useEffect(() => {
    if (prefersReduced) {
      // no motion: short hold then reveal
      const id = setTimeout(() => finish(), 400);
      return () => clearTimeout(id);
    }

    const urls = Array.from(new Set(preloadUrls)).filter(Boolean);
    const total = urls.length || 4;
    let done = 0;

    const step = () => {
      done += 1;
      // grow to 95% max; final jump to 100 at finish()
      targetRef.current = Math.min(0.95, Math.max(targetRef.current, done / total));
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
      // fake steps if nothing provided
      const fake = setInterval(step, 180);
      setTimeout(() => clearInterval(fake), 900);
    }

    // hard cap
    const cap = setTimeout(() => finish(), maxDurationMs);
    return () => {
      clearTimeout(cap);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preloadUrls, prefersReduced, maxDurationMs]);

  // reveal function: push progress to 100, then hide splash and reveal app root
  function finish() {
    targetRef.current = 1;
    if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    setTimeout(() => {
      setVisible(false);
      // reveal app content
      const el = document.getElementById(revealTargetId);
      if (el) el.classList.add("ready");
    }, 220);
  }

  const pct = Math.round(progress * 100);
  const wordmark = theme === "light" ? wordmarkLight : wordmarkDark;

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          className="fixed inset-0 z-[100] overflow-hidden"
          aria-hidden
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReduced ? 0.2 : 0.45, ease: [0.2, 0, 0, 1] }}
        >
          {/* full-screen blur field */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 opacity-95"
              style={{
                background:
                  "radial-gradient(1200px 600px at 10% -10%, rgba(14,165,233,0.18), transparent 60%), radial-gradient(900px 480px at 90% 0%, rgba(255,255,255,0.10), transparent 60%)",
                filter: "blur(28px) saturate(150%)"
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.02'/></svg>\")",
                backgroundSize: "180px 180px"
              }}
            />
            {/* subtle dark veil so content beneath is unreadable */}
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* centered content */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center p-6">
            {/* pulsing wordmark */}
            <m.img
              src={wordmark}
              alt="isaac seiler"
              className="max-w-[70vw] md:max-w-[46vw] select-none"
              draggable={false}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: [1, 1.012, 1] }}
              transition={{
                duration: prefersReduced ? 0.2 : 1.4,
                ease: [0.2, 0, 0, 1],
                repeat: prefersReduced ? 0 : Infinity,
                repeatDelay: 1.6
              }}
            />

            {/* progress bar with real width */}
            <div className="mt-8 w-[72vw] max-w-[560px]">
              <div className="relative h-[4px] w-full overflow-hidden rounded-full border border-subtle/60 bg-[color:var(--color-bg)]/35 backdrop-blur">
                <m.div
                  className="absolute left-0 top-0 h-full"
                  style={{
                    width: `${pct}%`,
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,.55), rgba(255,255,255,.95))"
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.18 }}
                />
                {/* glow sweep */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.10) 45%, rgba(255,255,255,0) 90%)",
                    backgroundSize: "200% 100%",
                    animation: "sweep 1.3s linear infinite"
                  }}
                />
              </div>
            </div>
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
