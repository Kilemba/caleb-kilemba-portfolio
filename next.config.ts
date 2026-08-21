import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output is for self-hosting (Docker). Vercel supplies its own build
  // adapter, and the two conflict: the trace files land elsewhere and Vercel's
  // onBuildComplete fails looking for .next/next-server.js.nft.json.
  output: process.env.VERCEL ? undefined : "standalone",
  // Blog posts are read from /content at request time as well as at build time. Without
  // this, file tracing does not see the directory and the folder is missing from the
  // deployed function bundle — posts render locally but vanish in production.
  outputFileTracingIncludes: {
    "/": ["./content/**/*"],
    "/blog": ["./content/**/*"],
    "/blog/[slug]": ["./content/**/*"],
    "/sitemap.xml": ["./content/**/*"],
    "/rss.xml": ["./content/**/*"]
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" }
    ]
  }
};

export default nextConfig;
