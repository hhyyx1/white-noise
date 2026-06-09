import type { NextConfig } from "next";

const isStatic = process.env.BUILD_MODE === 'static';
const isDocker = process.env.BUILD_MODE === 'docker';

const nextConfig: NextConfig = {
  // 根据环境变量决定是否使用静态导出
  ...(isStatic && {
    output: 'export',
    trailingSlash: true,
    distDir: 'out',
  }),
  
  // Docker 镜像使用 standalone 输出，减小生产镜像体积
  ...(isDocker && {
    output: 'standalone',
  }),

  images: {
    unoptimized: true
  },

  // 忽略 ESLint 警告阻断生产部署
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // 解决 Node.js 内置模块警告
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    return config;
  },
  
  // 只在非静态模式下添加 headers
  ...(!isStatic && {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Cross-Origin-Embedder-Policy',
              value: 'unsafe-none',
            },
            {
              key: 'Cross-Origin-Opener-Policy',
              value: 'same-origin-allow-popups',
            },
          ],
        },
      ];
    },
  }),
};

export default nextConfig;
