import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  swcMinify: true, // 可以保留
  compiler: {
    styledComponents: true, // 如果用 styled-components
  },
  // webpack 配置，强制 Babel 转译 node_modules 中的现代 JS
  webpack(config, { isServer }) {
    if (!isServer) {
      config.module.rules.push({
        test: /\.m?js$/,
        exclude: /node_modules[/\\](?!some-es6-package)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "next/babel",
                {
                  "preset-env": {
                    targets: {
                      android: "5", // 支持安卓 5+
                    },
                    useBuiltIns: "entry",
                    corejs: 3,
                  },
                },
              ],
            ],
          },
        },
      });
    }
    return config;
  },
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
