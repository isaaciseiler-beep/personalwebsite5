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
      // Ignore clicks on interactive elements marked with data-no-fx
      if ((e.target as HTMLElement)?.closest("[data-no-fx]")) return;
      clearTimeout(t.current ?? undefined);
      t.current = window.setTimeout(() => setOn(true), 1000); // 1s hold
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
          // Full footer background (edge-to-edge inside footer)
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "conic-gradient(from 90deg at 50% 50%, #e40303, #ff8c00, #ffed00, #008026, #24408e, #732982, #e40303)",
          }}
        />
      )}
    </AnimatePresence>
  );
}
