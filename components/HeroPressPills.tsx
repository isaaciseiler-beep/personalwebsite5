// components/HeroPressPills.tsx — FULL REPLACEMENT (compat shim)
"use client";

// Keep default component import working for older code.
export { default } from "@/components/PressShowcase";

import { PILLS as BASE } from "@/components/PressShowcase";

/** New canonical shape used across app: { label, href } */
export type Pill = { href: string; label: string };
export const PILLS: Pill[] = BASE;

/** Legacy shape expected by Nav.tsx: { name, href } */
export type LegacyPill = { href: string; name: string };

/** Explicitly export PRESS_PILLS in the legacy shape. */
export const PRESS_PILLS = BASE.map(p => ({ href: p.href, name: p.label })) as readonly {
  href: string;
  name: string;
}[];
