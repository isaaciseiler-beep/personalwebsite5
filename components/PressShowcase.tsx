"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform, useMotionTemplate } from "framer-motion";
import { useState } from "react";

type PressItem = {
  title: string;
  href?: string;
  source?: string;
  date?: string;
  image?: string; // Cloudflare R2 CDN URL
};

const pressItems: PressItem[] = [
  {
    title: "Isaac featured in launch of ChatGPT Pulse",
    href: "#",
    source: "OpenAI",
    image: `${process.env.NEXT_PUBLIC_CDN_BASE ?? ""}/press/pulse.jpg`,
  },
  {
    title: "On ChatGPT Study Mode",
    href: "#",
    source: "OpenAI",
    image: `${process.env.NEXT_PUBLIC_CDN_BASE ?? ""}/press/study-mode.jpg`,
  },
  {
    title: "Rhodes Scholar finalist",
    href: "#",
    source: "Rhodes Trust",
    image: `${process.env.NEXT_PUBLIC_CDN_BASE ?? ""}/press/rhodes.jpg`,
  },
  {
    title: "Truman Scholarship",
    href: "#",
    source: "The Truman Foundation",
    image: `${process.env.NEXT_PUBLIC_CDN_BASE ?? ""}/press/truman.jpg`,
  },
  {
    title: "Fulbright to Taiwan",
    href: "#",
    source: "Fulbright",
    image: `${process.env.NEXT_PUBLIC_CDN_BASE ?? ""}/press/fulbright.jpg`,
  },
  {
    title: "Washington University profile",
    href: "#",
    source: "WUSTL",
    image: `${process.env.NEXT_PUBLIC_CDN_BASE ?? ""}/press/wustl.jpg`,
  },
];

export default function PressShowcase() {
  return (
    <section className="mx-auto mt-20 max-w-6xl px-4">
      <h2 className="mb-6 text-2xl font-semibold text-foreground">in the news</h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pressItems.map((item, i) => (
          <PressCard key={i} item={item} />
        ))}
      </div>
    </section>
  );
}

function PressCard({ item }: { item: PressItem }) {
  const [hovered, setHovered] = useState(false);

  // Cursor-responsive glow (very subtle for white cards; does not affect text)
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const gx = useTransform(x, (v) => v * 100);
  const gy = useTransform(y, (v) => v * 100);
  const glow = useMotionTemplate`radial-gradient(400px circle at ${gx}% ${gy}%, rgba(0,0,0,0.06), transparent 70%)`;

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width);
    y.set((e.clientY - r.top) / r.height);
  }

  return (
    <motion.a
      href={item.href || "#"}
      target={item.href ? "_blank" : undefined}
      rel="noopener noreferrer"
      onMouseMove={onMove}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{
        scale: 1.02,
        rotateX: -2,
        rotateY: 2,
        transition: { type: "spring", stiffness: 220, damping: 16 },
      }}
      style={{ backgroundImage: glow }}
      // card-hover class matches your other cards; white tile + soft border + true black text
      className="card-hover group relative flex min-h-[150px] items-stretch overflow-hidden rounded-2xl border border-neutral-200 bg-white text-black shadow-sm transition-transform duration-300"
    >
      {/* Left content (70%) */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 p-5">
        <h3
          // No color/opacity toggles -> no blink. Only transform/underline on hover.
          className="text-[1.05rem] font-semibold leading-snug tracking-tight will-change-transform"
        >
          <span className="bg-gradient-to-r from-black to-black bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size,transform] duration-300 group-hover:bg-[length:100%_1px]">
            {item.title}
          </span>
        </h3>

        {item.source && (
          <p className="text-sm text-neutral-600">{item.source}</p>
        )}

        {item.date && (
          <p className="text-xs text-neutral-500">{item.date}</p>
        )}
      </div>

      {/* Right media (30%) */}
      <div className="relative hidden w-[30%] shrink-0 items-stretch sm:flex">
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {/* Image wrapper with subtle parallax */}
        <motion.div
          className="relative h-full w-full"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
        >
          {item.image ? (
            <Image
              src={item.image}
              alt=""
              fill
              priority={false}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 30vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-neutral-100" />
          )}
          {/* soft left fade for text readability */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent" />
        </motion.div>
      </div>

      {/* Focus ring */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-black/0 transition-shadow duration-300 group-focus-visible:ring-2 group-focus-visible:ring-black/20" />
    </motion.a>
  );
}
