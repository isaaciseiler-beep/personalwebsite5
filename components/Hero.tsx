"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ScrollCue from "@/components/ScrollCue";

function useTheme(): "dark" | "light" {
  const [t, setT] = useState<"dark" | "light">(
    (typeof document !== "undefined" &&
      (document.documentElement.getAttribute("data-theme") as "dark" | "light")) || "dark"
  );
  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => {
      setT(el.getAttribute("data-theme") === "light" ? "light" : "dark");
    });
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return t;
}

export default function Hero() {
  const theme = useTheme();
  const src = theme === "light" ? "/isaacseiler-lightmode.png" : "/isaacseiler-darkmode.png";

  return (
    <section className="relative isolate overflow-hidden">
      <div className="hero-bg absolute inset-0" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 md:py-28">
        <div>
          <div className="inline-block">
            <Image
              src={src}
              alt="Isaac Seiler wordmark"
              priority
              width={1600}
              height={600}
              sizes="(min-width: 1024px) 900px, (min-width: 768px) 720px, 90vw"
              className="h-auto w-full max-w-[900px] select-none"
              draggable={false}
            />
          </div>

          <p className="mt-6 max-w-xl text-muted">
            building at the edge of ai, policy, and visual storytelling. projects, photos, research.
          </p>

          <div className="mt-6 flex gap-3">
            <Link
              href="/about"
              prefetch
              className="rounded-xl border border-subtle px-4 py-2 hover:border-[color:var(--color-accent)]/60"
            >
              about
            </Link>
            <Link
              href="/work"
              prefetch
              className="rounded-xl border border-subtle px-4 py-2 hover:border-[color:var(--color-accent)]/60"
            >
              my work
            </Link>
          </div>

          <ScrollCue />
        </div>
      </div>
    </section>
  );
}

