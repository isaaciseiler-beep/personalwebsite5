"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Props = {
  image: string;                 // single image URL (right 33%)
  blurbs?: string[];             // 5–6 rotating headers (BW only)
  bio?: string;                  // short bio (~100 → ~50% length)
  linkedinUrl?: string;          // optional
  emailHref?: string;            // optional "mailto:..."
  lines?: string[];              // legacy -> mapped to blurbs
};

export default function PinnedAbout({
  image,
  blurbs,
  bio,
  linkedinUrl = "https://www.linkedin.com/in/isaacseiler",
  emailHref = "mailto:hello@isaacseiler.com",
  lines,
}: Props) {
  const prefers = useReducedMotion();

  // headers (no gradients, BW only)
  const items = (blurbs?.length ? blurbs : lines?.length ? lines : DEFAULT_BLURBS).slice(0, 6);

  // rotate every ~5s
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (prefers || items.length <= 1) return;
    const t = setInterval(() => setIdx((v) => (v + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [prefers, items.length]);

  const bioText = bio?.trim().length ? bio : DEFAULT_BIO_SHORT;

  return (
    <section id="about" className="w-full px-4 md:px-6">
      {/* CARD — matches site cards, fills page width */}
      <div className="card-hover w-full overflow-hidden rounded-2xl border border-subtle bg-card">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* TEXT (2/3) */}
          <div className="md:col-span-2 p-5 md:p-7">
            {/* Fixed 3-line header slot to prevent reflow */}
            <div
              className="relative"
              style={{
                lineHeight: 1.15,
                minHeight: "calc(1em * 3 * 1.15)", // reserve exactly 3 lines
              }}
            >
              <AnimatePresence mode="wait">
                <motion.h3
                  key={idx}
                  initial={{ opacity: 0, y: 12, scale: 0.99, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, scale: 0.995, filter: "blur(8px)" }}
                  transition={{ duration: 0.9, ease: [0.22, 0.72, 0.12, 1] }}
                  className="absolute inset-x-0 top-0 text-2xl font-medium leading-tight text-white md:text-4xl"
                >
                  {items[idx]}
                </motion.h3>
              </AnimatePresence>
            </div>

            {/* ~50% shorter bio */}
            <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">{bioText}</p>

            {/* Actions: unified style, more interesting hover */}
            <div className="mt-5 flex flex-wrap gap-3">
              <CTA href="/about">About me →</CTA>
              <CTA href={linkedinUrl}>LinkedIn →</CTA>
              <CTA href={emailHref}>Email →</CTA>
            </div>
          </div>

          {/* IMAGE (1/3) */}
          <div className="relative h-[280px] overflow-hidden md:h-full">
            <div className="group absolute inset-0">
              <Image
                src={image}
                alt="About image"
                fill
                priority
                sizes="(min-width:768px) 33vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Unified CTA button consistent with site cards */
function CTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-white transition
                 hover:bg-white/[0.06] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.35)]
                 focus:outline-none focus:ring-2 focus:ring-sky-400/40 active:scale-[0.985]"
    >
      {children}
    </a>
  );
}

const DEFAULT_BLURBS = [
  "Fulbright scholar documenting AI uses in education",
  "Expert on digital disruption and innovation in journalism and media",
  "Served as the youngest Communications Director in congressional history",
  "Photographer, videographer, and internationally licensed drone pilot",
  "Member of ChatGPT Lab @ OpenAI, informing product decisions",
  "Skilled strategic communicator with cross-sector experience",
];

// ~50% of prior length
const DEFAULT_BIO_SHORT =
  "I work where media, civic data, and applied AI meet. Current research tracks real classroom uses of generative tools and which workflows endure. I’ve led communications across government and nonprofits, translating complex policy into clear narratives. I build small products, study AI’s impact on local journalism, and help teams adopt practical AI. Off hours I shoot photo and video and fly drones internationally.";
