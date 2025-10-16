/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    remotePatterns: [
      // Cloudflare R2 public domain
      { protocol: "https", hostname: "pub-41d52824b0bb4f44898c39e1c3c63cb8.r2.dev" },
      // Custom CDN (uncomment or edit if using a custom host)
      { protocol: "https", hostname: "cdn.isaacseiler.com" },
      { protocol: "https", hostname: "images.isaacseiler.com" },
      { protocol: "https", hostname: "static.isaacseiler.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

export default nextConfig;
