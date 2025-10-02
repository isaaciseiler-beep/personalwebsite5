export type Project = {
  slug: string;
  title: string;
  kind: "project" | "photo" | "video"; // added "video"
  summary?: string;
  image?: string;          // poster or thumbnail
  video?: string;          // optional video src (mp4/webm), used when kind === "video"
  tags?: string[];
  year?: number;
  url?: string;

  // media location (for map)
  location?: string;
  lat?: number;
  lng?: number;
};
