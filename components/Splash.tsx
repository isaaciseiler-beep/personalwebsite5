// components/Splash.tsx — FULL REPLACEMENT (no Skip button)
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { m, AnimatePresence } from "framer-motion";

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

function useReducedMotion() {
  const [pref, setPref] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPref(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return pref;
}

type Props = {
  preloadUrls?: string[];
  logoLight?: string;
  logoDark?: string;
  maxDurationMs?: number;
  revealTargetId?: string;
  onDone?: () => void;
};

export default function Splash({
  preloadUrls = [],
  logoLight = "/logo-dark.png",
  logoDark = "/logo-light.png",
  maxDurationMs = 2400,
  revealTargetId = "app-root",
  onDone,
}: Props) {
  const theme = useTheme();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [flash, setFlash] = useState(false);
  const doneRef = useRef(false);

  const steps = useMemo(
    () => [
      "Warming up UI",
      "Linking modules",
      "Priming models",
      "Optimizing assets",
      "Final checks",
    ],
    []
  );
  const stepIndex = Math.min(steps.length - 1, Math.floor(progress * steps.length));

  useEffect(() => {
    let done = 0;
    const urls = Array.from(new Set(preloadUrls)).filter(Boolean);
    const total = urls.length || 4;

    const ramp = setInterval(() => {
      setProgress((p) => {
        const target = 0.98;
        const next = p + (target - p) * 0.08;
        return Math.min(next, target);
      });
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
    }

    const cap = setTimeout(() => finish(), maxDurationMs);

    return () => {
      clearInterval(ramp);
      clearTimeout(cap);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preloadUrls, maxDurationMs]);

  function completeAndHide() {
    if (doneRef.current) return;
    doneRef.current = true;
    setVisible(false);
    const el = document.getElementById(revealTargetId);
    if (el) el.classList.add("ready");
    onDone?.();
  }

  function finish() {
    setProgress(1);
    if (!reduce) {
      setFlash(true);
      setTimeout(() => setFlash(false), 220);
    }
    setTimeout(completeAndHide, 240);
  }

  const pct = Math.round(progress * 100);
  const logoSrc = theme === "light" ? logoLight : logoDark;

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          className="fixed inset-0 z-[100] overflow-hidden"
          aria-hidden={false}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.2, 0, 0, 1] }}
        >
          {/* blurred backdrop */}
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: reduce ? "none" : "blur(24px) saturate(160%)",
              WebkitBackdropFilter: reduce ? "none" : "blur(24px) saturate(160%)",
              background:
                "radial-gradient(1200px 600px at 10% -10%, rgba(14,165,233,0.18), transparent 60%), radial-gradient(900px 480px at 90% 0%, rgba(255,255,255,0.10), transparent 60%), rgba(0,0,0,0.40)",
            }}
          />

          {/* ambient gradient drift */}
          {!reduce && (
            <div
              className="pointer-events-none absolute -inset-8 opacity-30"
              style={{
                background:
                  "radial-gradient(60% 40% at 70% 30%, rgba(14,165,233,0.12), transparent 60%), radial-gradient(40% 30% at 20% 70%, rgba(255,255,255,0.06), transparent 60%)",
                animation: "bg-drift 14s ease-in-out infinite",
              }}
            />
          )}

          {/* content */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center p-6">
            {/* logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <m.img
              src={logoSrc}
              alt="site logo"
              width={52}
              height={52}
              className="select-none"
              draggable={false}
              style={{
                width: 52,
                height: 52,
                objectFit: "contain",
                filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25))",
              }}
              animate={reduce ? {} : { scale: [1, 1.06, 1] }}
              transition={reduce ? {} : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* progress bar + status */}
            <div className="mt-12 w-[72vw] max-w-[560px]">
              <div
                className="relative h-[4px] w-full overflow-hidden rounded-full bg-white/30 backdrop-blur"
                role="progressbar"
                aria-label="Loading"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
              >
                <div
                  className="absolute left-0 top-0 h-full"
                  style={{
                    width: `${pct}%`,
                    transition: "width 180ms ease",
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,.55), rgba(255,255,255,.95))",
                  }}
                />
                {!reduce && (
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.10) 45%, rgba(255,255,255,0) 90%)",
                      backgroundSize: "200% 100%",
                      animation: "sweep 1.3s linear infinite",
                    }}
                  />
                )}
              </div>

              {/* status line */}
              <div className="mt-3 flex items-center justify-between text-xs text-white/70">
                <AnimatePresence mode="wait">
                  <m.span
                    key={stepIndex}
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -8, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    {steps[stepIndex]}
                  </m.span>
                </AnimatePresence>
                <span aria-hidden>{pct}%</span>
              </div>
            </div>
          </div>

          {/* outro flash */}
          <AnimatePresence>
            {flash && !reduce && (
              <m.div
                className="pointer-events-none absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.55 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                style={{
                  background:
                    "radial-gradient(600px 600px at 50% 50%, rgba(255,255,255,0.9), rgba(255,255,255,0.0) 60%)",
                }}
              />
            )}
          </AnimatePresence>

          <style jsx global>{`
            @keyframes sweep {
              0% {
                background-position: 200% 0;
              }
              100% {
                background-position: -200% 0;
              }
            }
            @keyframes bg-drift {
              0% {
                transform: translate3d(0, 0, 0);
              }
              50% {
                transform: translate3d(0, -2%, 0);
              }
              100% {
                transform: translate3d(0, 0, 0);
              }
            }
          `}</style>
        </m.div>
      )}
    </AnimatePresence>
  );
}
