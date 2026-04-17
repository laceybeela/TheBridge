import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["astronomy-engine"],
  serverExternalPackages: ["geo-tz"],
};

export default nextConfig;
