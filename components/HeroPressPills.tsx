// components/HeroPressPills.tsx — FULL REPLACEMENT (compat shim)
export { default } from "@/components/PressShowcase";
export type { Pill } from "@/components/PressShowcase";
import { PILLS as BASE } from "@/components/PressShowcase";

/** Legacy shape expected by Nav.tsx: { name, href } */
export type LegacyPill = { href: string; name: string };

/** PRESS_PILLS keeps Nav.tsx working without edits */
export const PRESS_PILLS: LegacyPill[] = BASE.map(p => ({ href: p.href, name: p.label }));

/** Also re-export PILLS for any new code using { label, href } */
export const PILLS = BASE;
