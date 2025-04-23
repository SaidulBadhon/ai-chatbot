import type { NextConfig } from 'next';

// experimental: {
//   ppr: true,
// },
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
};

export default nextConfig;
