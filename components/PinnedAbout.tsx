"use client";

import { useEffect, useState, CSSProperties } from "react";
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

  const items = (blurbs?.length ? blurbs : lines?.length ? lines : DEFAULT_BLURBS)
    .map((t) => (/youngest|congress/i.test(t) ? "youngest communications director in the u.s. congress" : t))
    .slice(0, 6);

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (prefers || items.length <= 1) return;
    const t = setInterval(() => setIdx((v) => (v + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [prefers, items.length]);

  const bioText =
    bio?.trim()
      ? bio
      : "I work where media, civic data, and applied AI meet. Current research tracks classroom uses of generative tools and the workflows that last. I’ve led communications in government and nonprofits, translating policy into clear narratives. I build small products, study AI’s effects on local journalism, and help teams adopt practical AI. Off hours I shoot photo and video and fly drones internationally.";

  // fixed two-line header slot
  const slotVars = { "--lh": 1.14, "--slot": "clamp(5.6rem,9vw,8.8rem)" } as CSSProperties;

  return (
    <section id="about" className="py-8">
      {/* EXACTLY matches projects/status container */}
      <div className="mx-auto max-w-5xl px-4">
        <div className="card-hover w-full overflow-hidden rounded-2xl border border-subtle bg-card">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* text 2/3 */}
            <div className="p-5 md:col-span-2 md:p-7">
              <div className="relative" style={slotVars}>
                <div className="relative h-[var(--slot)]" style={{ lineHeight: "var(--lh)" }}>
                  <AnimatePresence mode="wait">
                    <motion.h3
                      key={idx}
                      initial={{ opacity: 0, y: 18, scale: 0.985, filter: "blur(10px)", clipPath: "inset(12% 0 12% 0)" }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)", clipPath: "inset(0 0 0 0)" }}
                      exit={{ opacity: 0, y: -16, scale: 0.985, filter: "blur(10px)", clipPath: "inset(12% 0 12% 0)" }}
                      transition={{ duration: 1.05, ease: [0.22, 0.72, 0.12, 1] }}
                      className="absolute inset-x-0 top-0 text-2xl font-normal leading-tight text-white md:text-4xl"
                    >
                      {items[idx]}
                    </motion.h3>
                  </AnimatePresence>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">{bioText}</p>

              <div className="mt-5 flex flex-wrap gap-3">
                <CTA href="/about">about me →</CTA>
                <CTA href={linkedinUrl}>linkedin →</CTA>
                <CTA href={emailHref}>email →</CTA>
              </div>
            </div>

            {/* image 1/3 */}
            <figure className="relative h-[280px] overflow-hidden md:h-full">
              <div className="group absolute inset-0">
                <Image
                  src={image}
                  alt="about image"
                  fill
                  priority
                  sizes="(min-width:768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
              </div>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-sm normal-case text-white transition
                 hover:bg-white/[0.06] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.35)]
                 focus:outline-none focus:ring-2 focus:ring-sky-400/40 active:scale-[0.985]"
    >
      {children}
    </a>
  );
}

const DEFAULT_BLURBS = [
  "fulbright scholar documenting ai uses in education",
  "expert on digital disruption and innovation in journalism and media",
  "youngest communications director in the u.s. congress",
  "photographer, videographer, and internationally licensed drone pilot",
  "member of chatgpt lab @ openai, informing product decisions",
  "skilled strategic communicator with cross-sector experience",
];
