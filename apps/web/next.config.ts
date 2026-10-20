import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Monorepo: tell Next.js to trace dependencies from the workspace root
  outputFileTracingRoot: path.join(__dirname, "../../"),
  transpilePackages: [
    "astronomy-engine",
    "@bridge/shared-types",
    "@bridge/interpretations",
    "@bridge/astrology-core",
  ],
  serverExternalPackages: ["geo-tz"],
  // Ensure geo-tz data files are included in serverless function bundles
  outputFileTracingIncludes: {
    "/*": ["./node_modules/geo-tz/data/**"],
  },
};

export default nextConfig;
