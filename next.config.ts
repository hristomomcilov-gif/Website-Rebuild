import type { NextConfig } from "next";

/**
 * Static export keeps the rebuild deployable as plain files (no server, no
 * database) and matches the trailing-slash URL style of the live site
 * (e.g. `/ai-card/`).
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Lets the same static export be hosted under a sub-path (e.g. a GitHub
  // Pages project site) without touching any route or link.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
};

export default nextConfig;
