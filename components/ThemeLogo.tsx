// components/ThemeLogo.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function ThemeLogo({ size = 42 }: { size?: number }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => {
      const t = el.getAttribute("data-theme") === "light" ? "light" : "dark";
      setTheme(t);
    });
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const src = theme === "light" ? "/logo-dark.png" : "/logo-light.png";

  return (
    <Image
      src={src}
      alt="isaac logo"
      width={size}
      height={size}
      className="rounded-full"
      priority
    />
  );
}
