import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui"],
  serverExternalPackages: ["better-sqlite3"],
  reactCompiler: true,
};

export default nextConfig;
