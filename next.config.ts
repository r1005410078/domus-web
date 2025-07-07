import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: false, // 关闭构建活动指示器
    appIsrStatus: false,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // 代理前缀
        destination: "http://localhost:9002/api/:path*", // 目标地址
      },
    ];
  },
};

export default nextConfig;
