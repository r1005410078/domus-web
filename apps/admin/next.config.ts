import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true, // 如果用 styled-components
  },
  turbopack: {},
  async rewrites() {
    return [
      {
        source: "/api/domus/:path*", // 代理前缀
        destination: `${process.env.DOMUS_API_URL}/api/domus/:path*`, // 目标地址
      },
      {
        source: "/api/user_system/:path*", // 代理前缀
        destination: `${process.env.USER_SYSTEM_API_URL}/api/user_system/:path*`, // 目标地址
      },
      {
        source: "/api/filestore/:path*", // 代理前缀
        destination: `${process.env.FILE_STORE}/api/filestore/:path*`, // 目标地址
      },
      {
        source: "/domus-houses-images/:path*", // 代理前缀
        destination: `${process.env.IMAGE_PROXY_URL}/domus-houses-images/:path*`, // 目标地址
      },
    ];
  },
};

export default withPWA({
  dest: "public",
  register: true,
})(nextConfig as any) as any;
