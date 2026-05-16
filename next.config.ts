import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Disable image optimisation so placeholder paths that don't exist on
    // disk are served as-is without triggering the optimisation pipeline.
    // This is appropriate for development with placeholder images; swap for
    // remotePatterns / localPatterns once real assets are in place.
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
