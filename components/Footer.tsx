// components/Footer.tsx
import Link from "next/link";
import { Github, Linkedin, ExternalLink } from "lucide-react";
import { getRepoMeta } from "@/lib/github";
import EmailButton from "./EmailButton";

export default async function Footer() {
  const meta = await getRepoMeta();
  const year = new Date().getFullYear();
  const starsLabel =
    typeof meta.stars === "number"
      ? new Intl.NumberFormat("en-US", { notation: "compact" }).format(meta.stars)
      : "—";
  const shortSha = meta.sha ? meta.sha.slice(0, 7) : "dev";

  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-10 pt-12">
      {/* OSS strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Github className="h-4 w-4" aria-hidden />
          <span className="text-[var(--color-muted)]">Open-source:</span>
          <Link
            href="https://github.com/isaaciseiler-beep/personalwebsite5"
            className="underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            isaaciseiler-beep/personalwebsite5
          </Link>
          <span className="text-[var(--color-muted)]">·</span>
          <span className="tabular-nums">{starsLabel}★</span>
          <span className="text-[var(--color-muted)]">·</span>
          <span className="text-[var(--color-muted)]">latest</span>
          <code className="ml-1 rounded bg-black/20 px-1">{shortSha}</code>
          <Link
            href={meta.url}
            className="ml-2 inline-flex items-center gap-1 text-[var(--color-muted)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            .git <ExternalLink className="h-3 w-3" aria-hidden />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="https://www.linkedin.com/in/isaaciseiler"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="h-4 w-4" aria-hidden />
            <span>LinkedIn</span>
          </Link>
          <EmailButton />
        </div>
      </div>

      {/* Link clusters */}
      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        {/* Site */}
        <nav className="text-sm">
          <div className="mb-3 font-medium">Site</div>
          <ul className="space-y-2">
            <li>
              <Link href="/#work" className="hover:underline underline-offset-4">
                Work
              </Link>
            </li>
            <li>
              <Link href="/photos" className="hover:underline underline-offset-4">
                Photos
              </Link>
            </li>
            <li>
              <Link href="/press" className="hover:underline underline-offset-4">
                Press
              </Link>
            </li>
            <li>
              <Link href="/#about" className="hover:underline underline-offset-4">
                About
              </Link>
              <span className="ml-2 rounded-full border border-[var(--color-border)] px-2 py-0.5 text-[10px] text-[var(--color-muted)]">
                section
              </span>
            </li>
          </ul>
        </nav>

        {/* Meta */}
        <nav className="text-sm">
          <div className="mb-3 font-medium">Meta</div>
          <ul className="space-y-2">
            {/* Use anchor, not onClick, to avoid server-event handlers */}
            <li>
              <Link href="#" className="hover:underline underline-offset-4">
                Back to top
              </Link>
            </li>
            <li className="text-[var(--color-muted)]">
              Built with Next.js · Tailwind · Framer Motion · Vercel · R2
            </li>
          </ul>
        </nav>

        {/* Copyright */}
        <div className="text-sm text-[var(--color-muted)]">
          <p>© {year} Isaac Seiler. All rights reserved.</p>
          <p className="mt-2">
            Design tokens: dark by default. Accent <code>#0ea5e9</code>.
          </p>
        </div>
      </div>
    </footer>
  );
}
