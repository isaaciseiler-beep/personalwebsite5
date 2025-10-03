// next.config.mjs — FULL REPLACEMENT
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: "https", hostname: "isaacs-portfolio.r2.dev" },
      // if you later add a custom domain like media.example.com, add it here too:
      // { protocol: "https", hostname: "media.example.com" }
    ]
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"]
  }
};
export default nextConfig;
