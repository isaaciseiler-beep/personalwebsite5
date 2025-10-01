export type Project = {
  slug: string;
  title: string;
  kind: "project" | "photo";
  summary?: string;
  image?: string;
  tags?: string[];
  year?: number;
  url?: string;
};

