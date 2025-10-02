import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://YOUR-DOMAIN";
  const now = new Date();
  const urls = ["/", "/about", "/work", "/work/projects", "/work/photos"];
  return urls.map((p) => ({ url: `${base}${p}`, lastModified: now }));
}
