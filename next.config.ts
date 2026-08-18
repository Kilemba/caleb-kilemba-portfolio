import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output is for self-hosting (Docker). Vercel supplies its own build
  // adapter, and the two conflict: the trace files land elsewhere and Vercel's
  // onBuildComplete fails looking for .next/next-server.js.nft.json.
  output: process.env.VERCEL ? undefined : "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" }
    ]
  }
};

export default nextConfig;
