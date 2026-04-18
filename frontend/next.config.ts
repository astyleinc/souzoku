import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // APIは同一オリジンの /api/* にマウント済みのため rewrites は不要
  transpilePackages: ['ouver-api'],
  serverExternalPackages: ['postgres', 'better-auth'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
