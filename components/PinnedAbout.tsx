"use client";

import Link from "next/link";
import ShimmerImage from "@/components/ShimmerImage";

type PinnedAboutProps = {
  lines: string[];
  /** e.g., "about/isaac-about-card.jpg" in your R2 bucket */
  imageName: string;
  /** optional override; defaults to env or your public R2 */
  imageBaseUrl?: string;
  ctas?: { href: string; label: string }[];
};

export default function PinnedAbout({
  lines,
  imageName,
  imageBaseUrl,
  ctas = [
    { href: "/about", label: "about me" },
    { href: "/contact", label: "collab" },
  ],
}: PinnedAboutProps) {
  const base =
    imageBaseUrl ??
    process.env.NEXT_PUBLIC_CDN_BASE ??
    "https://pub-41d52824b0bb4f44898c39e1c3c63cb8.r2.dev";

  const src = `${base.replace(/\/$/, "")}/${imageName.replace(/^\//, "")}`;

  return (
    <section className="py-6">
      <div className="mx-auto max-w-5xl px-4">
        <div
          className="
            group grid grid-cols-1 md:grid-cols-3
            overflow-hidden rounded-2xl border border-subtle bg-card
            shadow-[0_1px_0_0_hsla(0,0%,100%,0.04)_inset,0_0_0_1px_hsla(0,0%,0%,0.4)_inset]
            transition-transform duration-300
            md:h-[320px]
          "
        >
          {/* Text */}
          <div className="relative col-span-2 p-6 md:p-8">
            <h2 className="mb-3 text-xl">about</h2>

            <div className="space-y-1.5">
              <p className="text-balance text-lg md:text-xl">
                {lines[0] ?? ""}
              </p>
              {lines.slice(1).map((l, i) => (
                <p key={i} className="text-muted">
                  {l}
                </p>
              ))}
            </div>

            {/* Chips */}
            <div className="mt-5 flex flex-wrap gap-2">
              {["ai × policy", "visual explainers", "taipei"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-subtle bg-[rgba(255,255,255,0.02)] px-3 py-1 text-xs text-muted"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-5 flex gap-3">
              {ctas.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  prefetch
                  className="link-underline text-sm text-muted hover:text-[color:var(--color-accent)]"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Image right = ~33% */}
          <div className="relative">
            <div className="absolute inset-0">
              <ShimmerImage
                src={src}
                alt="about image"
                width={1200}
                height={1600}
                priority
                className="
                  h-full w-full object-cover
                  transition-transform duration-500 group-hover:scale-[1.02]
                "
              />
            </div>

            {/* Subtle edge divider */}
            <div className="absolute left-0 top-0 h-full w-px bg-[hsla(0,0%,100%,0.06)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
