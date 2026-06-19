import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "landings-cdn.adsterratech.com",
        pathname: "/referralBanners/**"
      }
    ]
  },
  experimental: {
    optimizePackageImports: ["@supabase/supabase-js", "react-window"]
  },
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|css|js|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      }
    ];
  }
};

export default nextConfig;
