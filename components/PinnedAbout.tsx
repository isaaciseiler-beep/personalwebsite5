"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

type NewProps = { heading?: [string, string]; blurbs?: string[]; images?: string[] };
type LegacyProps = { lines?: string[]; imageName?: string; imageBaseUrl?: string };
type Props = NewProps & LegacyProps;

export default function PinnedAbout(props: Props) {
  // content
  const blurbs =
    props.blurbs && props.blurbs.length
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
    (props.images && props.images.length ? props.images : undefined) ??
    (props.imageBaseUrl && props.imageName
      ? [`${props.imageBaseUrl.replace(/\/$/, "")}/${props.imageName}`]
      : []);

  const prefers = useReducedMotion();

  // ---------- typewriter: slower + irregular ----------
  const [bIdx, setBIdx] = useState(0);
  const [txt, setTxt] = useState("");
  const [phase, setPhase] = useState<"type" | "hold" | "erase">("type");

  useEffect(() => {
    if (prefers) {
      setTxt(blurbs[bIdx]);
      return;
    }
    const full = blurbs[bIdx];

    // base cadence
    const randomJitter = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    let delay = 40; // fallback
    if (phase === "type") {
      // irregular typing: vary speed and insert micro-pauses on punctuation and word boundaries
      const nextLen = txt.length + 1;
      const nextChar = full.charAt(nextLen - 1);
      const isPunct = /[.,;:!?]/.test(nextChar);
      const boundaryPause = nextChar === " " ? randomJitter(60, 160) : 0;
      delay = randomJitter(26, 75) + (isPunct ? randomJitter(140, 320) : 0) + boundaryPause;

      const t = setTimeout(() => {
        const next = full.slice(0, nextLen);
        setTxt(next);
        if (next === full) setPhase("hold");
      }, delay);
      return () => clearTimeout(t);
    }

    if (phase === "hold") {
      // longer hold
      delay = 2200 + randomJitter(300, 900);
      const t = setTimeout(() => setPhase("erase"), delay);
      return () => clearTimeout(t);
    }

    if (phase === "erase") {
      // irregular erase in 1–3 char chunks
      const chunk = Math.min(txt.length, randomJitter(1, 3));
      delay = randomJitter(22, 60);
      const t = setTimeout(() => {
        const next = txt.slice(0, Math.max(0, txt.length - chunk));
        setTxt(next);
        if (next.length === 0) {
          setBIdx((v) => (v + 1) % blurbs.length);
          setPhase("type");
        }
      }, delay);
      return () => clearTimeout(t);
    }
  }, [txt, phase, bIdx, prefers, blurbs]);

  // sync image to current blurb index
  const imgIdx = images.length ? bIdx % images.length : 0;

  const hVariants = useMemo(
    () => ({ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }),
    []
  );

  return (
    <section id="about" className="relative mx-auto mt-6 max-w-6xl px-4 md:px-6" aria-label="About">
      {/* subtle grid + ambient glow */}
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
        {/* TEXT BLOCK — single dynamic line only */}
        <div className="md:col-span-2 md:pr-4">
          <motion.h2 initial="hidden" animate="show" variants={hVariants} className="mb-2 text-sm tracking-wide text-muted">
            about
          </motion.h2>

          <motion.h1
            initial="hidden"
            animate="show"
            variants={hVariants}
            className="relative text-3xl leading-tight md:text-5xl"
          >
            <span className="bg-gradient-to-r from-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
              {prefers ? blurbs[0] : txt}
            </span>
            {!prefers && <Caret />}
          </motion.h1>
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

function Caret() {
  return (
    <span className="ml-1 inline-block h-[0.9em] w-[2px] align-baseline bg-current animate-[blink_1.2s_steps(2,start)_infinite]" />
  );
}
