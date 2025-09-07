import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/domus/:path*", // 代理前缀
        destination: `${process.env.DOMUS_API_URL}/api/domus/:path*`, // 目标地址
      },
      {
        source: "/api/user_system/:path*", // 代理前缀
        destination: `http://192.168.2.10:9001/api/user_system/:path*`, // 目标地址
      },
    ];
  },
};

export default nextConfig;
