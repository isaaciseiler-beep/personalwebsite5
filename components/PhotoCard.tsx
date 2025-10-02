"use client";

import Image from "next/image";
import { m } from "framer-motion";
import type { Project } from "@/types/project";

type Props = { item: Project; onClick?: (src: string, alt: string) => void };

export default function PhotoCard({ item, onClick }: Props) {
  return (
    <button aria-label={`view ${item.title}`} className="block h-full text-left" onClick={() => onClick?.(item.image ?? "", item.title)}>
      <m.div
        whileHover={{ y: -2, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 260, damping: 24, mass: 0.6 }}
        className="h-full"
      >
        <div className="overflow-hidden rounded-xl border border-subtle bg-card">
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
              <span className="rounded-full border border-subtle px-2 py-0.5 text-xs text-muted">{item.location}</span>
            )}
          </div>
        </div>
      </m.div>
    </button>
  );
}
