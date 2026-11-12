import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  allowedDevOrigins: [process.env.NEXT_PUBLIC_DEV_ORIGIN!],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.IMAGE_HOSTNAME!,
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
}

export default nextConfig
