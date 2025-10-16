"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform, useMotionTemplate } from "framer-motion";
import { useState } from "react";

type PressItem = {
  title: string;
  href?: string;
  source?: string;
  date?: string;
  image?: string;
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
    source: "Truman Foundation",
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
    <section className="mx-auto mt-14 max-w-6xl px-4">
      <h2 className="mb-4 text-2xl font-normal text-neutral-100">
        in the news
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pressItems.map((item, i) => (
          <PressCard key={i} item={item} />
        ))}
      </div>
    </section>
  );
}

function PressCard({ item }: { item: PressItem }) {
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const gx = useTransform(x, (v) => v * 100);
  const gy = useTransform(y, (v) => v * 100);
  const glow = useMotionTemplate`radial-gradient(400px circle at ${gx}% ${gy}%, rgba(56,189,248,0.08), transparent 70%)`;

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width);
    y.set((e.clientY - r.top) / r.height);
  }

  return (
    <motion.a
      href={item.href || "#"}
      target={item.href ? "_blank" : undefined}
      rel="noopener noreferrer"
      onMouseMove={handleMove}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{
        scale: 1.02,
        rotateX: -2,
        rotateY: 2,
        transition: { type: "spring", stiffness: 220, damping: 16 },
      }}
      style={{ backgroundImage: glow }}
      className="group relative flex min-h-[150px] items-stretch overflow-hidden rounded-2xl border border-neutral-800/70 bg-neutral-950/70 p-5 text-left text-neutral-100 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur-md transition-transform duration-300"
    >
      {/* Left content */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 pr-3">
        <h3 className="text-[1.05rem] leading-snug tracking-tight text-neutral-100">
          <span className="bg-gradient-to-r from-sky-400/80 to-teal-300/80 bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size,transform] duration-300 group-hover:bg-[length:100%_2px]">
            {item.title}
          </span>
        </h3>
        {item.source && (
          <p className="text-sm text-neutral-400">{item.source}</p>
        )}
        {item.date && (
          <p className="text-xs text-neutral-500">{item.date}</p>
        )}
      </div>

      {/* Right image */}
      <div className="relative hidden w-[30%] shrink-0 sm:block">
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
            <div className="h-full w-full bg-neutral-800" />
          )}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-neutral-950 to-transparent" />
        </motion.div>
      </div>
    </motion.a>
  );
}
