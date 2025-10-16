// components/NowBar.tsx — FINAL
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
      <div className="rounded-2xl border border-neutral-800/70 bg-neutral-950/70 p-6 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          {/* Left block */}
          <div>
            <div className="flex items-center gap-2.5 text-[13px] leading-none text-neutral-400">
              {/* Breathing status dot */}
              <motion.span
                aria-hidden
                className="inline-block h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.5)]"
                animate={{ scale: [0.9, 1.22, 0.9] }}
                transition={{
                  duration: 1.9,
                  repeat: Infinity,
                  ease: [0.45, 0, 0.55, 1],
                }}
              />
              <span className="tracking-wider uppercase">now</span>
            </div>

            <p className="mt-2 text-[1.18rem] leading-snug text-neutral-100 sm:text-[1.25rem]">
              taipei → building with AI, fulbright grantee, seeking tech jobs for 2026.
            </p>
            <p className="mt-1 text-neutral-400">always open to collaborate</p>
          </div>

          {/* Right link */}
          <Link
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact via LinkedIn"
            className="group relative text-base font-medium text-sky-400 transition-colors duration-300 hover:text-sky-300"
          >
            <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-sky-400 after:transition-all after:duration-300 group-hover:after:w-full">
              contact →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
