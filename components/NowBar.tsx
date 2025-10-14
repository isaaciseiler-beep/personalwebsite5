// components/NowBar.tsx — FULL FILE
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NowBar({ text }: { text: string }) {
  if (!text) return null;

  const linkedin =
    process.env.NEXT_PUBLIC_LINKEDIN_URL ||
    "https://www.linkedin.com/in/isaacseiler";

  return (
    <section className="mx-auto mt-10 max-w-5xl px-4">
      <div className="rounded-xl border border-subtle bg-card px-5 py-4">
        <div className="flex items-center gap-3">
          {/* Pulsating green status circle */}
          <div className="relative h-3.5 w-3.5">
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full bg-green-500/40"
              animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.6, 0.15, 0.6] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="absolute inset-0 rounded-full bg-green-500 ring-2 ring-green-500/30" />
          </div>

          <span className="text-sm uppercase tracking-wide text-muted-foreground">
            now
          </span>
        </div>

        <p className="mt-3 text-base text-foreground">
          taipei → building with AI, fulbright grantee, seeking tech jobs for 2026.
        </p>

        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            always open to collaborate
          </p>
          <Link
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg border border-subtle bg-accent px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-accent/70"
          >
            contact
          </Link>
        </div>
      </div>
    </section>
  );
}
