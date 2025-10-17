"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  heading: [string, string];
  blurbs: string[];
  images: string[];
};

export default function PinnedAbout({ heading, blurbs, images }: Props) {
  const prefers = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const hold = useRef(false);

  // auto-rotate blurbs if motion allowed
  useEffect(() => {
    if (prefers || blurbs.length <= 1) return;
    const t = setInterval(() => {
      if (!hold.current) setIdx((v) => (v + 1) % blurbs.length);
    }, 3200);
    return () => clearInterval(t);
  }, [prefers, blurbs.length]);

  // sync image index to blurb index
  const imgIdx = idx % Math.max(1, images.length);

  const headingVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 8 },
      show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    }),
    []
  );

  return (
    <section
      id="about"
      className="relative mx-auto mt-8 max-w-6xl px-4 md:px-6"
      aria-label="About"
    >
      {/* ambient grid + grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          background:
            "repeating-linear-gradient(90deg, transparent 0 22px, #fff2 22px 23px), repeating-linear-gradient(0deg, transparent 0 22px, #fff2 22px 23px)",
          maskImage:
            "radial-gradient(1200px 600px at 20% 30%, #000 65%, transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-20 -z-10 blur-3xl"
        style={{
          background:
            "radial-gradient(600px 320px at 15% 20%, rgba(14,165,233,.18), transparent 60%), radial-gradient(500px 260px at 85% 70%, rgba(147,51,234,.18), transparent 60%)",
        }}
      />

      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-3">
        {/* TEXT BLOCK */}
        <div className="md:col-span-2 md:pr-4">
          <motion.h2
            initial="hidden"
            animate="show"
            variants={headingVariants}
            className="mb-3 text-base tracking-wide text-muted"
          >
            about
          </motion.h2>

          <motion.h3
            initial="hidden"
            animate="show"
            variants={headingVariants}
            className="relative mb-4 text-4xl leading-tight md:text-6xl"
          >
            <span className="bg-gradient-to-r from-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
              {heading[0]}
            </span>
            <span className="block">{heading[1]}</span>

            {/* animated underline */}
            <span className="pointer-events-none mt-3 block h-[3px] w-24 rounded-full bg-gradient-to-r from-sky-400 to-fuchsia-400">
              <span className="block h-full w-0 animate-[grow_1.2s_ease-out_forwards] bg-current" />
            </span>
          </motion.h3>

          {/* SWITCHING BLURB with caret */}
          <div
            onMouseEnter={() => (hold.current = true)}
            onMouseLeave={() => (hold.current = false)}
            className="relative mt-6"
          >
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur supports-[backdrop-filter]:bg-white/[0.03]">
              <motion.p
                key={idx}
                initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="pr-6 text-lg leading-relaxed md:text-xl"
              >
                {blurbs[idx]}
                <span className="ml-2 inline-block h-5 w-[2px] align-baseline bg-current animate-[blink_1.2s_steps(2,start)_infinite]" />
              </motion.p>

              {/* subtle corner accents */}
              <AccentCorners />
            </div>
            <p className="mt-3 text-xs text-muted">
              hover to pause • updates every ~3s
            </p>
          </div>
        </div>

        {/* IMAGE BLOCK, strict 33% on md+ */}
        <figure className="group relative h-[360px] overflow-hidden rounded-2xl border border-white/10 bg-card md:h-[560px]">
          {/* ambient glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 -z-10 rounded-[28px] blur-2xl transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(280px 200px at 70% 25%, rgba(14,165,233,.20), transparent 60%)",
              opacity: 0.7,
            }}
          />
          {/* image crossfade, hover zoom confined */}
          {images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt="portrait"
              fill
              priority={i === 0}
              sizes="(min-width:768px) 33vw, 100vw"
              className={`object-cover transition duration-600 ease-out will-change-transform ${
                i === imgIdx ? "opacity-100" : "opacity-0"
              } group-hover:scale-[1.06]`}
            />
          ))}

          {/* inner mask to keep zoom inside frame */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
          {/* glossy sweep on hover */}
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="absolute -left-52 top-0 h-full w-40 rotate-12 bg-gradient-to-r from-white/0 via-white/10 to-white/0 blur-sm" />
          </div>
          {/* caption optional */}
          <figcaption className="sr-only">About photo</figcaption>
        </figure>
      </div>

      {/* local keyframes */}
      <style jsx>{`
        @keyframes blink {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }
        @keyframes grow {
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}

/** Decorative corner brackets for the blurb card */
function AccentCorners() {
  const c = "absolute h-5 w-5 border-[2px] border-sky-400/60";
  return (
    <>
      <span className={`${c} left-3 top-3 rounded-tl-xl border-b-0 border-r-0`} />
      <span className={`${c} right-3 top-3 rounded-tr-xl border-b-0 border-l-0`} />
      <span className={`${c} bottom-3 left-3 rounded-bl-xl border-t-0 border-r-0`} />
      <span className={`${c} bottom-3 right-3 rounded-br-xl border-t-0 border-l-0`} />
    </>
  );
}
