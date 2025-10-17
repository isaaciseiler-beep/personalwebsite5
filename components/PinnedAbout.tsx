"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

type NewProps = { heading?: [string, string]; blurbs?: string[]; images?: string[] };
type LegacyProps = { lines?: string[]; imageName?: string; imageBaseUrl?: string };
type Props = NewProps & LegacyProps;

export default function PinnedAbout(props: Props) {
  // map legacy -> new
  const defaultHeading: [string, string] = ["civic data work between", "public sector."];
  const heading: [string, string] =
    props.heading ??
    (props.lines && props.lines.length
      ? (() => {
          // take last 2 words as line 2 if possible
          const s = props.lines[0];
          const parts = s.split(" ");
          if (parts.length > 2) {
            const l2 = parts.slice(-2).join(" ");
            const l1 = parts.slice(0, -2).join(" ");
            return [l1, l2];
          }
          return defaultHeading;
        })()
      : defaultHeading);

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

  // --- typewriter for first heading line ---
  const [i, setI] = useState(0); // blurb index
  const [display, setDisplay] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (prefers) {
      setDisplay(blurbs[0] ?? "");
      return;
    }
    const current = blurbs[i % blurbs.length];
    const doneTyping = display === current;
    const empty = display.length === 0;

    let delta = deleting ? 16 : 28; // speed
    if (doneTyping && !deleting) delta = 1400; // hold
    if (empty && deleting) delta = 280; // pause before next

    const t = setTimeout(() => {
      if (!deleting) {
        // type
        const next = current.slice(0, display.length + 1);
        setDisplay(next);
        if (next === current) setDeleting(true);
      } else {
        // delete
        const next = current.slice(0, Math.max(0, display.length - 2));
        setDisplay(next);
        if (next.length === 0) {
          setDeleting(false);
          setI((v) => (v + 1) % blurbs.length);
        }
      }
    }, delta);

    return () => clearTimeout(t);
  }, [display, deleting, i, prefers, blurbs]);

  // keep image synced with blurb index
  const imgIdx = images.length ? i % images.length : 0;

  const headingVariants = useMemo(
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
        {/* TEXT */}
        <div className="md:col-span-2 md:pr-4">
          <motion.h2 initial="hidden" animate="show" variants={headingVariants} className="mb-2 text-sm tracking-wide text-muted">
            about
          </motion.h2>

          {/* Dynamic first line */}
          <motion.h3
            initial="hidden"
            animate="show"
            variants={headingVariants}
            className="relative mb-2 text-3xl leading-tight md:text-5xl"
          >
            <span className="block bg-gradient-to-r from-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
              {prefers ? blurbs[0] : display}
              {!prefers && <Caret />}
            </span>
            <span className="block">{heading[1]}</span>
            <span className="pointer-events-none mt-2 block h-[2px] w-20 rounded-full bg-gradient-to-r from-sky-400 to-fuchsia-400">
              <span className="block h-full w-0 animate-[grow_1.1s_ease-out_forwards] bg-current" />
            </span>
          </motion.h3>
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

      <style jsx>{`
        @keyframes grow {
          to {
            width: 100%;
          }
        }
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}

function Caret() {
  return <span className="ml-1 inline-block h-[0.9em] w-[2px] align-baseline bg-current animate-[blink_1.1s_steps(2,start)_infinite]" />;
}
