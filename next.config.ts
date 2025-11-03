import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "img.icons8.com" },
      { hostname: "static.cdninstagram.com" },
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "firebasestorage.googleapis.com" },
    ],
  },
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  allowedDevOrigins: ["10.200.21.185"],
};

export default nextConfig;
