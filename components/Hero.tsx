// components/Hero.tsx — FULL FILE REPLACEMENT
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

const NAME = "isaac seiler";

export default function Hero() {
  // subtle parallax and scale on scroll
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -12]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.985]);

  return (
    <section className="relative isolate">
      {/* background flourish: lines that react to pointer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(50%_50%_at_50%_50%,black,transparent)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0_49%,_currentColor_50%,transparent_51%)] opacity-[0.04] bg-[length:4px_100%]" />
      </div>

      <motion.div style={{ y, scale }} className="mx-auto max-w-5xl px-4 pt-20 pb-10 sm:pt-28 sm:pb-14">
        {/* dynamic name */}
        <h1
          className="hero-name select-none text-balance text-[12vw] leading-[0.9] tracking-[-0.02em] sm:text-[8rem]"
          aria-label={NAME}
        >
          <AnimatedName text={NAME} />
        </h1>

        {/* subcopy */}
        <p className="mt-6 max-w-2xl text-pretty text-base text-[color:var(--color-fg)]/80">
          Portfolio, experiments, and work notes at the edge of AI, product, and communications.
        </p>

        {/* actions */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/experience"
            className="pressable text-reactive rounded-xl border border-white/10 px-4 py-2 text-sm"
          >
            Experience
          </Link>
          <Link
            href="/work/projects"
            className="pressable text-reactive rounded-xl border border-white/10 px-4 py-2 text-sm"
          >
            Projects
          </Link>
          <Link
            href="/about"
            className="pressable text-reactive rounded-xl border border-white/10 px-4 py-2 text-sm"
          >
            About
          </Link>
          <a
            href="mailto:isaac.seiler@outlook.com"
            className="pressable text-reactive rounded-xl border border-white/10 px-4 py-2 text-sm"
          >
            Contact
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function AnimatedName({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [hover, setHover] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  // track cursor inside bounding box
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setCoords({ x, y });
  };

  const onLeave = () => {
    setHover(false);
    setCoords({ x: 0, y: 0 });
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={onLeave}
      animate={{
        rotateX: hover ? coords.y * -10 : 0,
        rotateY: hover ? coords.x * 10 : 0,
        scale: hover ? 1.04 : 1,
        color: hover ? "var(--color-accent)" : "var(--color-fg)",
      }}
      transition={{ type: "spring", stiffness: 120, damping: 12 }}
      className="inline-block perspective-[800px] cursor-default"
    >
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          className="inline-block will-change-transform"
          whileHover={{ y: [0, -2, 0], transition: { duration: 0.4, repeat: 0 } }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
      <span aria-hidden className="hero-stroke" />
    </motion.span>
  );
}
