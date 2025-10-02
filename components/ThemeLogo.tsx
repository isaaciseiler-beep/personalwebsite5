// components/ThemeLogo.tsx — FULL FILE
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export default function ThemeLogo({ size = 42 }: { size?: number }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [fallbackStage, setFallbackStage] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const el = document.documentElement;
    const cb = () => setTheme(el.getAttribute("data-theme") === "light" ? "light" : "dark");
    cb();
    const obs = new MutationObserver(cb);
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const src = useMemo(() => {
    const base = theme === "light" ? "logo-dark" : "logo-light";
    if (fallbackStage === 0) return `/${base}.png`;
    if (fallbackStage === 1) return `/${base}.svg`;
    return "";
  }, [theme, fallbackStage]);

  if (!src) {
    return <span className="inline-block h-[42px] w-[42px] rounded-full border border-subtle bg-card" aria-label="logo" />;
  }

  return (
    <Image
      src={src}
      alt="isaac logo"
      width={size}
      height={size}
      className="rounded-full"
      priority
      onError={() => setFallbackStage(s => (s < 2 ? (s + 1) as 1 | 2 : s))}
    />
  );
}
