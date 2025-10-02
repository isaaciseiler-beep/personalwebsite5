export type TimelineEvent = {
  year: number;
  role: string;
  org?: string;
  summary?: string;
  link?: string;
  group?: "career" | "creative" | "research"; // optional; defaults to "career"
};
