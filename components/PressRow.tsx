// components/PressRow.tsx — FULL REPLACEMENT (reads from the same list; text fallback if no logos)
"use client";

import Link from "next/link";
import Image from "next/image";
import { pressItems } from "@/components/HeroPressPills";

export default function PressRow() {
  if (!pressItems.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-6 opacity-80">
      {pressItems.map(item => (
        <Link
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          {item.logo ? (
            <Image
              src={item.logo}
              alt={item.alt ?? item.name}
              width={96}
              height={24}
              className="h-6 w-auto object-contain"
            />
          ) : (
            <span className="text-sm">{item.name}</span>
          )}
        </Link>
      ))}
    </div>
  );
}
