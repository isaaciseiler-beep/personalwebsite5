"use client";

import { m } from "framer-motion";
import { useEffect, useState } from "react";

export default function ScrollCue() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // fade out between 20–120px
      setShow(y < 120);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <m.button
      type="button"
      onClick={goAbout}
      className="mt-10 flex w-full justify-center text-sm text-muted"
      aria-label="scroll to about"
      initial={{ opacity: 1, y: -6 }}
      animate={{ opacity: show ? 1 : 0, y: show ? -6 : -2 }}
      transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
      style={{ pointerEvents: show ? "auto" : "none" }}
    >
      ↓ scroll
    </m.button>
  );
}
