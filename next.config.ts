import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-3bfe14d0c2c34e5687e41c228cf8ae2e.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
