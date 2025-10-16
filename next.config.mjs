/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    remotePatterns: [
      // use ONE of these depending on which domain you’re serving from:
      // Cloudflare R2 public domain
      { protocol: "https", hostname: "pub-41d52824b0bb4f44898c39e1c3c63cb8.r2.dev" },

      // OR your custom CDN domain (preferred)
      // { protocol: "https", hostname: "cdn.isaacseiler.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

export default nextConfig;
