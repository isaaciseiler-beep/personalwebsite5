// components/EdgeProgress.tsx — FULL FILE
"use client";

import { useEffect, useState } from "react";

export default function EdgeProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className="fixed left-0 top-0 z-40 w-[2px] bg-[color:var(--color-accent)]/70 origin-top"
      style={{ height: `${Math.min(100, Math.max(0, p * 100))}vh` }}
    />
  );
}
