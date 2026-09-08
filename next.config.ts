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
};

export default nextConfig;
