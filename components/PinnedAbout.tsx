"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type NewProps = { blurbs?: string[]; images?: string[] };
type LegacyProps = { lines?: string[]; imageName?: string; imageBaseUrl?: string };
type Props = NewProps & LegacyProps;

export default function PinnedAbout(props: Props) {
  // content
  const blurbs =
    props.blurbs?.length
      ? props.blurbs
      : [
          "Fulbright scholar documenting AI uses in education",
          "Expert on digital disruption and innovation in journalism and media",
          "Served as the youngest Communications Director in congressional history",
          "Photographer, videographer, and internationally licensed drone pilot",
          "Member of ChatGPT Lab @ OpenAI, informing product decisions",
          "Skilled strategic communicator with cross-sector experience",
        ];

  const images =
    props.images?.length
      ? props.images
      : props.imageBaseUrl && props.imageName
      ? [`${props.imageBaseUrl.replace(/\/$/, "")}/${props.imageName}`]
      : [];

  const prefers = useReducedMotion();
  const [i, setI] = useState(0);
  const hold = useRef(false);

  // original-style rotation: timed crossfade, pause on hover
  useEffect(() => {
    if (prefers || blurbs.length <= 1) return;
    const t = setInterval(() => {
      if (!hold.current) setI((v) => (v + 1) % blurbs.length);
    }, 3200);
    return () => clearInterval(t);
  }, [prefers, blurbs.length]);

  const imgIdx = images.length ? i % images.length : 0;

  const hVariants = useMemo(
    () => ({ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }),
    []
  );

  return (
    <section id="about" className="relative mx-auto mt-6 max-w-6xl px-4 md:px-6" aria-label="About">
      {/* subtle grid + glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          background:
            "repeating-linear-gradient(90deg,transparent 0 22px,#fff2 22px 23px),repeating-linear-gradient(0deg,transparent 0 22px,#fff2 22px 23px)",
          maskImage: "radial-gradient(1200px 600px at 22% 30%,#000 65%,transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-24 -z-10 blur-3xl"
        style={{
          background:
            "radial-gradient(520px 280px at 15% 18%, rgba(14,165,233,.16), transparent 60%), radial-gradient(460px 240px at 85% 72%, rgba(147,51,234,.16), transparent 60%)",
        }}
      />

      <div className="grid grid-cols-1 items-start gap-7 md:grid-cols-3">
        {/* TEXT with original glass CARD */}
        <div className="md:col-span-2 md:pr-4">
          <motion.h2 initial="hidden" animate="show" variants={hVariants} className="mb-3 text-sm tracking-wide text-muted">
            about
          </motion.h2>

          <div
            onMouseEnter={() => (hold.current = true)}
            onMouseLeave={() => (hold.current = false)}
            className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur supports-[backdrop-filter]:bg-white/[0.03] md:p-5"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={prefers ? `static-${i}` : i}
                initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                transition={{ duration: 0.45 }}
                className="pr-6 text-xl leading-relaxed md:text-2xl"
              >
                {prefers ? blurbs[0] : blurbs[i]}
              </motion.p>
            </AnimatePresence>

            <AccentCorners />
          </div>
        </div>

        {/* IMAGE 33% on md+, confined hover */}
        <figure className="group relative h-[320px] overflow-hidden rounded-2xl border border-white/10 bg-card md:h-[500px]">
          {images.map((src, j) => (
            <Image
              key={`${src}-${j}`}
              src={src}
              alt="about image"
              fill
              priority={j === 0}
              sizes="(min-width:768px) 33vw, 100vw"
              className={`object-cover transition duration-600 ease-out will-change-transform ${
                j === imgIdx ? "opacity-100" : "opacity-0"
              } group-hover:scale-[1.05]`}
            />
          ))}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="absolute -left-52 top-0 h-full w-40 rotate-12 bg-gradient-to-r from-white/0 via-white/10 to-white/0 blur-sm" />
          </div>
        </figure>
      </div>
    </section>
  );
}

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
