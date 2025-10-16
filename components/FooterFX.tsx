"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function FooterFX() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const root = document.getElementById("site-footer");
    if (!root) return;

    const down = () => setOn(true);
    const up = () => setOn(false);

    root.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("blur", up);
    window.addEventListener("scroll", up, { passive: true });

    return () => {
      root.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
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
          className="pointer-events-none fixed inset-0 z-[60]"
          style={{
            background:
              "conic-gradient(from 90deg at 50% 50%, #e40303, #ff8c00, #ffed00, #008026, #24408e, #732982, #e40303)",
          }}
        />
      )}
    </AnimatePresence>
  );
}
