// next.config.mjs — FULL REPLACEMENT
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false, // let next/image optimize & serve responsive formats
    remotePatterns: [
      { protocol: "https", hostname: "pub-41d52824b0bb4f44898c39e1c3c63cb8.r2.dev" }
      // add your custom media domain here later if you make one
    ]
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"]
  }
};
export default nextConfig;
