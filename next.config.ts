import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // 代理前缀
        destination: "http://localhost:9001/api/:path*", // 目标地址
      },
    ];
  },
};

export default nextConfig;
