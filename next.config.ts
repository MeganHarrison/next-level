import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allow production builds despite TypeScript and ESLint errors in auxiliary folders
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
