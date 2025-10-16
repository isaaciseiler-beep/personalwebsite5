"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform, useMotionTemplate } from "framer-motion";
import { useState } from "react";

type PressItem = {
  title: string;
  href: string;
  source?: string;
  image?: string;
};

const pressItems: PressItem[] = [
  {
    title: "Featured in launch of ChatGPT Pulse",
    href: "https://openai.com/index/introducing-chatgpt-pulse/",
    source: "OpenAI",
    image: `${process.env.NEXT_PUBLIC_CDN_BASE ?? ""}/press/pulse.jpg`,
  },
  {
    title: "OpenAI Instagram spotlight on ChatGPT Study Mode",
    href: "https://www.instagram.com/chatgpt/reel/DNyG5VvXEZM/",
    source: "OpenAI",
    image: `${process.env.NEXT_PUBLIC_CDN_BASE ?? ""}/press/study-mode.jpg`,
  },
  {
    title: "WashU Rhodes Scholar finalist",
    href: "https://source.washu.edu/2024/11/seniors-darden-seiler-were-rhodes-scholars-finalists/",
    source: "Rhodes Trust",
    image: `${process.env.NEXT_PUBLIC_CDN_BASE ?? ""}/press/rhodes.jpg`,
  },
  {
    title: "Co-published Book on Education Uses of ChatGPT",
    href: "https://chatgpt.com/100chats-project",
    source: "OpenAI",
    image: `${process.env.NEXT_PUBLIC_CDN_BASE ?? ""}/press/100chats.jpg`,
  },
  {
    title: "Awarded 2024 Michigan Truman Scholarship",
    href: "https://artsci.washu.edu/ampersand/junior-seiler-awarded-truman-scholarship",
    source: "Washington University",
    image: `${process.env.NEXT_PUBLIC_CDN_BASE ?? ""}/press/truman.jpg`,
  },
  {
    title: "Awarded 2025 Fulbright to Taiwan",
    href: "https://source.washu.edu/2025/06/several-alumni-earn-fulbright-awards/",
    source: "Washington University",
    image: `${process.env.NEXT_PUBLIC_CDN_BASE ?? ""}/press/fulbright.jpg`,
  },
  {
    title: "University profile",
    href: "https://artsci.washu.edu/ampersand/isaac-seiler-setting-his-sights-high",
    source: "Washington University",
    image: `${process.env.NEXT_PUBLIC_CDN_BASE ?? ""}/press/wustl.jpg`,
  },
];

export default function PressShowcase() {
  return (
    <section className="mx-auto mt-14 max-w-6xl px-4">
      <h2 className="mb-4 text-2xl font-normal text-neutral-100">in the news</h2>

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
  const glow = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgba(56,189,248,0.08), transparent 70%)`;

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width);
    y.set((e.clientY - r.top) / r.height);
  }

  return (
    <motion.a
      href={item.href}
      target="_blank"
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
      className="group relative flex min-h-[170px] items-stretch overflow-hidden rounded-2xl border border-neutral-800/70 bg-neutral-950/80 text-left text-neutral-100 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur-md transition-transform duration-300"
    >
      {/* Left content */}
      <div className="flex min-w-0 flex-[0_0_67%] flex-col justify-center gap-1 p-5">
        <h3 className="text-[1.05rem] leading-snug tracking-tight">
          <span className="bg-[linear-gradient(white,white)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size,transform] duration-300 group-hover:bg-[length:100%_2px]">
            {item.title}
          </span>
        </h3>
        {item.source && <p className="text-sm text-neutral-400">{item.source}</p>}
      </div>

      {/* Right 33% image — fills card edge to edge */}
      <div className="relative flex-[0_0_33%] select-none pointer-events-none">
        {item.image ? (
          <Image
            src={item.image}
            alt=""
            fill
            priority={false}
            sizes="(min-width:1024px) 33vw, (min-width:640px) 33vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-neutral-800" />
        )}
      </div>
    </motion.a>
  );
}
