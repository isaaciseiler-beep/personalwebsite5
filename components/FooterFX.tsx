"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export default function FooterFX() {
  const [on, setOn] = useState(false);
  const seq = useRef<string[]>([]);
  const hold = useRef<number | null>(null);

  // Toggle via typing "pride"
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      seq.current.push(k);
      if (seq.current.join("").includes("pride")) {
        setOn((v) => !v);
        seq.current = [];
      }
      if (seq.current.length > 10) seq.current.shift();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Long-press anywhere on footer
  useEffect(() => {
    const root = document.getElementById("site-footer");
    if (!root) return;
    const down = () => {
      clearTimeout(hold.current ?? undefined);
      hold.current = window.setTimeout(() => setOn((v) => !v), 650);
    };
    const up = () => {
      clearTimeout(hold.current ?? undefined);
      hold.current = null;
    };
    root.addEventListener("pointerdown", down);
    root.addEventListener("pointerup", up);
    root.addEventListener("pointerleave", up);
    return () => {
      root.removeEventListener("pointerdown", down);
      root.removeEventListener("pointerup", up);
      root.removeEventListener("pointerleave", up);
    };
  }, []);

  return (
    <AnimatePresence>
      {on && (
        <motion.div
          key="prideFx"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.0 }}
          transition={{ duration: 0.6 }}
          aria-hidden
          className={clsx(
            "pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
          )}
        >
          {/* Pride fluid background */}
          <div className="absolute -inset-8 blur-2xl opacity-70">
            <motion.div
              className="h-full w-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
              style={{
                background:
                  "conic-gradient(from 90deg at 50% 50%, #e40303, #ff8c00, #ffed00, #008026, #24408e, #732982, #e40303)",
              }}
            />
          </div>
          {/* Liquid mask pane */}
          <motion.div
            className="absolute inset-0"
            animate={{ backgroundPositionX: ["0%", "100%"], backgroundPositionY: ["0%", "100%"] }}
            transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
            style={{
              mixBlendMode: "overlay",
              backgroundImage:
                "radial-gradient(1200px 300px at 20% 0%, rgba(255,255,255,.12), transparent 60%), radial-gradient(900px 260px at 80% 100%, rgba(255,255,255,.10), transparent 60%)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
