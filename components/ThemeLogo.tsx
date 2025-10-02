"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Props = { size?: number };

export default function ThemeLogo({ size = 42 }: Props) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [err, setErr] = useState<"none" | "png-missing" | "svg-missing">("none");

  // watch theme attribute
  useEffect(() => {
    const el = document.documentElement;
    const set = () => {
      const t = el.getAttribute("data-theme") === "light" ? "light" : "dark";
      setTheme(t);
    };
    set();
    const obs = new MutationObserver(set);
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  // choose src with fallbacks: .png → .svg
  const src = useMemo(() => {
    const base = theme === "light" ? "logo-dark" : "logo-light";
    if (err === "none") return `/${base}.png`;
    if (err === "png-missing") return `/${base}.svg`;
    return ""; // will trigger text fallback
  }, [theme, err]);

  if (!src) {
    // last-resort text fallback so header never collapses
    return (
      <span
        aria-label="logo"
        className="inline-block h-[42px] w-[42px] rounded-full border border-subtle bg-card"
      />
    );
  }

  return (
    <Image
      src={src}
      alt="isaac logo"
      width={size}
      height={size}
      className="rounded-full"
      priority
      onError={() => setErr((e) => (e === "none" ? "png-missing" : "svg-missing"))}
    />
  );
}
