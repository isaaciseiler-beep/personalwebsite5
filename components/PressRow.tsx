"use client";

import Link from "next/link";
import Image from "next/image";
import { pressItems } from "@/components/PressShowcase";

export default function PressRow() {
  if (!pressItems.length) return null;
  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {pressItems.slice(0, 3).map((p, i) => (
        <Link key={i} href={p.href} target="_blank" rel="noopener noreferrer" className="group rounded-xl border border-subtle overflow-hidden bg-card">
          <div className="relative h-[140px] w-full">
            {p.image ? (
              <Image src={p.image} alt="" fill className="object-cover" />
            ) : (
              <div className="h-full w-full bg-neutral-800" />
            )}
          </div>
          <div className="p-3">
            <div className="text-sm">{p.title}</div>
            {p.source && <div className="text-xs text-muted mt-1">{p.source}</div>}
          </div>
        </Link>
      ))}
    </div>
  );
}
