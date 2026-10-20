import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "astronomy-engine",
    "@bridge/shared-types",
    "@bridge/interpretations",
    "@bridge/astrology-core",
  ],
  serverExternalPackages: ["geo-tz"],
  // Include geo-tz binary data files in serverless function bundles
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/geo-tz/**/*",
      "../../node_modules/.pnpm/geo-tz*/node_modules/geo-tz/data/**",
    ],
  },
};

export default nextConfig;
