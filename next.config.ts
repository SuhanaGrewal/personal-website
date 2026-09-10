import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pin the workspace root — otherwise Turbopack walks up to ~/ and
  // picks up an unrelated package-lock.json
  // the dev overlay sits exactly where the tagline does
  devIndicators: false,
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
