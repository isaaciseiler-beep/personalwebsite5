"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Props = {
  // preferred
  blurbs?: string[];           // 5–6 rotating headers
  image: string;               // single image URL
  bio?: string;                // optional 100-word bio placeholder

  // legacy support
  lines?: string[];            // map to blurbs if provided
};

export default function PinnedAbout({ blurbs, image, bio, lines }: Props) {
  const prefers = useReducedMotion();
  const items = (blurbs?.length ? blurbs : lines?.length ? lines : DEFAULT_BLURBS).slice(0, 6);

  const [idx, setIdx] = useState(0);
  const hold = useRef(false);

  useEffect(() => {
    if (prefers || items.length <= 1) return;
    const t = setInterval(() => {
      if (!hold.current) setIdx((v) => (v + 1) % items.length);
    }, 3200);
    return () => clearInterval(t);
  }, [prefers, items.length]);

  const bioText = bio?.trim().length ? bio : DEFAULT_BIO;

  return (
    <section id="about" className="mx-auto mt-8 max-w-6xl px-4 md:px-6">
      {/* CARD */}
      <div
        className="card-hover overflow-hidden rounded-2xl border border-subtle bg-card"
        onMouseEnter={() => (hold.current = true)}
        onMouseLeave={() => (hold.current = false)}
      >
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* TEXT SIDE (2/3) */}
          <div className="md:col-span-2 p-5 md:p-7">
            {/* Rotating header, black/white only, blur crossfade */}
            <div className="min-h-[3.2rem] md:min-h-[3.6rem]">
              <AnimatePresence mode="wait">
                <motion.h3
                  key={idx}
                  initial={{ opacity: 0, y: 6, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -6, filter: "blur(8px)" }}
                  transition={{ duration: 0.45 }}
                  className="text-2xl font-medium leading-tight md:text-4xl text-white"
                >
                  {items[idx]}
                </motion.h3>
              </AnimatePresence>
            </div>

            {/* 100-word bio placeholder */}
            <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
              {bioText}
            </p>

            {/* Link row */}
            <div className="mt-5">
              <a
                href="/about"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-white hover:bg-white/[0.04] transition"
              >
                About me <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          {/* IMAGE SIDE (1/3) */}
          <div className="relative h-[280px] overflow-hidden md:h-full">
            <div className="group absolute inset-0">
              <Image
                src={image}
                alt="About image"
                fill
                sizes="(min-width:768px) 33vw, 100vw"
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
              {/* subtle inner ring to match other cards */}
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-none md:rounded-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
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

// ~100 words, neutral placeholder you can replace anytime.
const DEFAULT_BIO =
  "I work at the intersection of civic data, media, and applied AI. My current research documents how educators adopt generative tools in real classrooms, with a focus on practical workflows and measurable impact. Previously I led communications in government and nonprofits, translating complex policy into clear narratives for diverse audiences. I also build small products and write about AI’s effects on local journalism and community information systems. Outside of work, I shoot photo and video and fly drones internationally. I’m interested in roles where strategy, writing, and product thinking meet.";
