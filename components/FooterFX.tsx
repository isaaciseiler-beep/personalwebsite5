"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function FooterFX() {
  const [on, setOn] = useState(false);
  const t = useRef<number | null>(null);

  useEffect(() => {
    const root = document.getElementById("site-footer");
    if (!root) return;

    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest("[data-no-fx]")) return;
      clearTimeout(t.current ?? undefined);
      t.current = window.setTimeout(() => setOn(true), 1000);
    };
    const up = () => {
      clearTimeout(t.current ?? undefined);
      t.current = null;
      setOn(false);
    };

    root.addEventListener("pointerdown", down);
    root.addEventListener("pointerup", up);
    root.addEventListener("pointerleave", up);
    window.addEventListener("blur", up);
    window.addEventListener("scroll", up, { passive: true });

    return () => {
      root.removeEventListener("pointerdown", down);
      root.removeEventListener("pointerup", up);
      root.removeEventListener("pointerleave", up);
      window.removeEventListener("blur", up);
      window.removeEventListener("scroll", up);
    };
  }, []);

  return (
    <AnimatePresence>
      {on && (
        <motion.div
          key="prideFx"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        >
          {/* Smooth, coreless rainbow using layered linear gradients */}
          <div
            className="absolute -inset-8 opacity-80 blur-2xl"
            style={{
              background:
                "linear-gradient(95deg,#e40303, #ff8c00, #ffed00, #008026, #24408e, #732982)",
            }}
          />
          {/* Soft light to avoid banding */}
          <div
            className="absolute inset-0"
            style={{
              mixBlendMode: "overlay",
              backgroundImage:
                "linear-gradient(180deg, rgba(255,255,255,.10), transparent 40% ), linear-gradient(0deg, rgba(255,255,255,.06), transparent 40%)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
