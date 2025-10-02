"use client";

import { m } from "framer-motion";
import { useEffect, useState } from "react";

export default function ScrollCue() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    function onScroll() {
      if (window.scrollY > 50) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="mt-10 flex justify-center">
      <m.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="text-sm text-muted"
        aria-hidden
      >
        ↓ scroll
      </m.div>
    </div>
  );
}
