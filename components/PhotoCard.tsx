"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/types/project";

type Props = {
  item: Project; // must be kind === "photo"
  onClick?: (src: string, alt: string) => void;
};

export default function PhotoCard({ item, onClick }: Props) {
  return (
    <button
      aria-label={`view ${item.title}`}
      className="block h-full text-left"
      onClick={() => onClick?.(item.image ?? "", item.title)}
    >
      <motion.div
        whileHover={{ y: -2, scale: 1.01 }}
        transition={{ duration: 0.12, ease: [0.2, 0, 0, 1] }}
        className="h-full"
      >
        <div className="overflow-hidden rounded-xl border border-subtle bg-card">
          {/* bigger visual focus */}
          {item.image && (
            <Image
              src={item.image}
              alt={item.title}
              width={1600}
              height={1200}
              className="h-72 w-full object-cover"
              loading="lazy"
            />
          )}
          <div className="flex items-center justify-between p-3">
            <div className="text-sm text-muted">{item.title}</div>
            {item.location && (
              <span className="rounded-full border border-subtle px-2 py-0.5 text-xs text-muted">
                {item.location}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </button>
  );
}
