// components/HeroPressPills.tsx — FULL REPLACEMENT
"use client";

// Keep legacy default import working.
export { default } from "@/components/PressShowcase";

import { PILLS as BASE } from "@/components/PressShowcase";

/** Shape Nav.tsx expects */
export type LegacyPill = { href: string; name: string };

/** PRESS_PILLS with {name, href} */
export const PRESS_PILLS: LegacyPill[] = BASE.map((p) => ({
  href: p.href,
  name: p.label,
}));
