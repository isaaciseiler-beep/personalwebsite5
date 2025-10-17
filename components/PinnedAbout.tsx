"use client";

import { useEffect, useRef, useState, CSSProperties } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Props = {
  image: string;
  blurbs?: string[];
  bio?: string;
  linkedinUrl?: string;
  emailHref?: string;
  lines?: string[];
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
  const items = (blurbs?.length ? blurbs : lines?.length ? lines : DEFAULT_BLURBS).slice(0, 6);

  // rotate every ~5s
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (prefers || items.length <= 1) return;
    const t = setInterval(() => setIdx((v) => (v + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [prefers, items.length]);

  const bioText = bio?.trim().length ? bio : DEFAULT_BIO_SHORT;

  // fixed 3-line slot height for header (prevents overlap/reflow)
  const headerVars = {
    "--hdr": "clamp(8rem, 10vw, 13.5rem)",
  } as CSSProperties;

  return (
    <section id="about" className="w-full px-0 md:px-0">
      <div
        className="card-hover w-full overflow-hidden rounded-2xl border border-subtle bg-card"
      >
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* TEXT (2/3) */}
          <div className="md:col-span-2 p-5 md:p-7">
            {/* reserved header area */}
            <div className="relative" style={headerVars}>
              <div className="h-[var(--hdr)] relative">
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={idx}
                    initial={{ opacity: 0, y: 12, scale: 0.99, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, scale: 0.995, filter: "blur(10px)" }}
                    transition={{ duration: 0.9, ease: [0.22, 0.72, 0.12, 1] }}
                    className="absolute inset-x-0 top-0 text-2xl font-medium leading-tight text-white md:text-4xl"
                  >
                    {items[idx]}
                  </motion.h3>
                </AnimatePresence>
              </div>
            </div>

            {/* Bio */}
            <p className="mt-2 text-sm leading-relaxed text-muted md:text-base">{bioText}</p>

            {/* CTAs */}
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

/* CTA style matching site */
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

const DEFAULT_BIO_SHORT =
  "I work where media, civic data, and applied AI meet. Current research tracks real classroom uses of generative tools and which workflows endure. I’ve led communications across government and nonprofits, translating complex policy into clear narratives. I build small products, study AI’s impact on local journalism, and help teams adopt practical AI. Off hours I shoot photo and video and fly drones internationally.";
