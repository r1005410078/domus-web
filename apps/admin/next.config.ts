import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: false, // 关闭构建活动指示器
    appIsrStatus: false,
  },
  async rewrites() {
    return [
      {
        source: "/api/domus/:path*", // 代理前缀
        destination: "http://localhost:9001/api/domus/:path*", // 目标地址
      },
      {
        source: "/api/user_system/:path*", // 代理前缀
        destination: "http://localhost:9000/api/user_system/:path*", // 目标地址
      },
    ];
  },
};

export default nextConfig;
