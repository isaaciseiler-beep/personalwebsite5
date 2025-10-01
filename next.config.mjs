/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  experimental: { optimizePackageImports: ["framer-motion", "lucide-react"] }
};
export default nextConfig;

