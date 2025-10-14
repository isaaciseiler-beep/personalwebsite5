// components/PressRow.tsx — FULL REPLACEMENT
"use client";

import Image from "next/image";
import Link from "next/link";
import { PILLS } from "@/components/HeroPressPills";

export default function PressRow() {
  if (!PILLS.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-6 opacity-80">
      {PILLS.map((it) => (
        <Link
          key={it.name}
          href={it.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          {it.logo ? (
            <Image
              src={it.logo}
              alt={it.alt ?? it.name}
              width={96}
              height={24}
              className="h-6 w-auto object-contain"
            />
          ) : (
            <span className="text-sm">{it.name}</span>
          )}
        </Link>
      ))}
    </div>
  );
}
