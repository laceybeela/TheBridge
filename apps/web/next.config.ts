import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "astronomy-engine",
    "@bridge/shared-types",
    "@bridge/interpretations",
    "@bridge/astrology-core",
  ],
  serverExternalPackages: ["geo-tz"],
};

export default nextConfig;
