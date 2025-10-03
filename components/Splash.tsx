"use client";

import { useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";

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
  preloadUrls?: string[];          // image URLs to warm up
  // NEW: header logo assets (small mark), defaults to typical names
  logoLight?: string;              // shown on LIGHT theme (usually black mark)
  logoDark?: string;               // shown on DARK theme  (usually white mark)
  // legacy props kept for compatibility (ignored now)
  wordmarkDark?: string;
  wordmarkLight?: string;
  maxDurationMs?: number;
  revealTargetId?: string;         // element to unblur (e.g., "app-root")
};

export default function Splash({
  preloadUrls = [],
  logoLight = "/logo-dark.png",    // light theme → dark logo
  logoDark = "/logo-light.png",    // dark theme  → light logo
  // legacy no-ops
  wordmarkDark,
  wordmarkLight,
  maxDurationMs = 2400,
  revealTargetId = "app-root"
}: Props) {
  const theme = useTheme();
  const [visible, setVisible] = useState(true);

  // simple determinate progress (always moves)
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let done = 0;
    const urls = Array.from(new Set(preloadUrls)).filter(Boolean);
    const total = urls.length || 4;

    // ramp so bar visibly moves even on cache hits
    const ramp = setInterval(() => {
      setProgress((p) => Math.min(0.92, p + 0.02));
    }, 90);

    const step = () => {
      done += 1;
      const pct = Math.min(0.95, done / total);
      setProgress((p) => (pct > p ? pct : p));
    };

    if (urls.length) {
      urls.forEach((u) => {
        const img = new Image();
        img.onload = step;
        img.onerror = step;
        img.src = u;
      });
    } else {
      const fake = setInterval(step, 180);
      setTimeout(() => clearInterval(fake), 900);
    }

    const cap = setTimeout(() => finish(), maxDurationMs);

    return () => {
      clearInterval(ramp);
      clearTimeout(cap);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preloadUrls, maxDurationMs]);

  function finish() {
    setProgress(1);
    setTimeout(() => {
      setVisible(false);
      const el = document.getElementById(revealTargetId);
      if (el) el.classList.add("ready"); // handled by AppRootStyles
    }, 220);
  }

  const pct = Math.round(progress * 100);
  const logoSrc = theme === "light" ? logoLight : logoDark;

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          className="fixed inset-0 z-[100] overflow-hidden"
          aria-hidden
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
        >
          {/* FULL-SCREEN BLUR over page */}
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
              background:
                "radial-gradient(1200px 600px at 10% -10%, rgba(14,165,233,0.18), transparent 60%), radial-gradient(900px 480px at 90% 0%, rgba(255,255,255,0.10), transparent 60%), rgba(0,0,0,0.40)"
            }}
          />
          {/* grain */}
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.02'/></svg>\")",
              backgroundSize: "180px 180px"
            }}
          />

          {/* CENTER: small pulsing header logo above bar */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center p-6">
            {/* small mark (match header icon) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt="site logo"
              width={88}
              height={88}
              className="select-none splash-pulse"
              draggable={false}
              style={{ width: 88, height: 88, objectFit: "contain" }}
            />

            {/* progress bar (NO outline) */}
            <div className="mt-12 w-[72vw] max-w-[560px]">
              <div className="relative h-[4px] w-full overflow-hidden rounded-full bg-white/35 backdrop-blur">
                <div
                  className="absolute left-0 top-0 h-full"
                  style={{
                    width: `${pct}%`,
                    transition: "width 180ms ease",
                    background: "linear-gradient(90deg, rgba(255,255,255,.55), rgba(255,255,255,.95))"
                  }}
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
            @keyframes pulseLogo {
              0% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.06); opacity: 0.95; } /* a touch stronger so it's visible */
              100% { transform: scale(1); opacity: 1; }
            }
            .splash-pulse {
              animation: pulseLogo 1200ms ease-in-out infinite;
              will-change: transform, opacity;
              filter: drop-shadow(0 6px 14px rgba(0,0,0,.25));
            }
          `}</style>
        </m.div>
      )}
    </AnimatePresence>
  );
}
