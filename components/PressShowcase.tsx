"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";

type PressItem = {
  title: string;
  href?: string;
  source?: string;
  date?: string;
};

const pressItems: PressItem[] = [
  { title: "Isaac featured in launch of ChatGPT Pulse", href: "#" },
  { title: "Isaac on OpenAI’s social media discussing uses of ChatGPT Study Mode", href: "#" },
  { title: "Isaac Seiler becomes Rhodes Scholar finalist", href: "#" },
  { title: "Isaac Seiler awarded the Truman Scholarship", href: "#" },
  { title: "Isaac wins a Fulbright Scholarship to Taiwan", href: "#" },
  { title: "Isaac’s profile by Washington University", href: "#" },
];

export default function PressShowcase() {
  return (
    <section className="mx-auto mt-20 max-w-6xl px-4">
      <h2 className="mb-6 text-2xl font-semibold text-neutral-100">
        in the news
      </h2>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.12 }}
        variants={{ hidden: {}, visible: {} }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {pressItems.map((item, i) => (
          <PressCard key={i} item={item} />
        ))}
      </motion.div>
    </section>
  );
}

function PressCard({ item }: { item: PressItem }) {
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // ✅ Type-safe transform mapping
  const background = useTransform<[number, number], string>(
    [x, y],
    ([lx, ly]) =>
      `radial-gradient(400px circle at ${lx * 100}% ${ly * 100}%, rgba(59,130,246,0.08), transparent 70%)`
  );

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    x.set(nx);
    y.set(ny);
  }

  return (
    <motion.a
      href={item.href || "#"}
      target={item.href ? "_blank" : undefined}
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 160, damping: 18 },
        },
      }}
      whileHover={{
        scale: 1.02,
        rotateX: -2,
        rotateY: 2,
        transition: { type: "spring", stiffness: 220, damping: 15 },
      }}
      style={{ background }}
      className="relative flex min-h-[120px] flex-col justify-center rounded-2xl border border-neutral-800/70 bg-neutral-950/70 p-5 text-left shadow-[0_0_20px_rgba(0,0,0,0.3)] backdrop-blur-md transition-transform duration-300"
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <h3
        className={`text-[1.05rem] leading-snug text-neutral-100 transition-colors duration-300 ${
          hovered
            ? "text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400"
            : ""
        }`}
      >
        {item.title}
      </h3>

      {item.source && (
        <p className="mt-2 text-sm text-neutral-500">{item.source}</p>
      )}
    </motion.a>
  );
}
