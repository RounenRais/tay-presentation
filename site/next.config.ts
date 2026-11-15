import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Plain static files (out/): the presentation needs no server, so any static host (Netlify) serves it as is
  output: "export",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
