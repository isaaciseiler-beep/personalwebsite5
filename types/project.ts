export type ProjectBase = {
  kind: "project" | "photo";
  slug: string;
  title: string;
};

export type ProjectExtra = {
  image?: string;
  tags?: string[];
  description?: string;
  category?: string;
  role?: string;
  type?: string;
  location?: string;
  url?: string;
  subtitle?: string;
  tagline?: string;
  summary?: string;
};

export type Project = ProjectBase & Partial<ProjectExtra>;
