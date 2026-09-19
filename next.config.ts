import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    return [
      { source: "/og.png", destination: "/opengraph-image" },
      { source: "/Ads.txt", destination: "/ads.txt" },
      { source: "/ADS.TXT", destination: "/ads.txt" },
    ];
  },
};

export default nextConfig;
