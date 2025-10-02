// types/timeline.ts — FULL REPLACEMENT
export type TimelineEvent = {
  dates: string;           // e.g., "August 2025 – Present"
  role: string;
  org?: string;
  summary?: string;        // brief narrative for the card
  link?: string;           // href
  link_text?: string;      // exact anchor text to display
};
