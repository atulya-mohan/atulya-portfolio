import type { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  
  // 👇 ADD (OR UPDATE) THIS 'images' BLOCK
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xvyzpsfpgpbozzcohpxa.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'xvyzpsfpgpbozzcohpxa.supabase.co',
        pathname: '/storage/v1/render/image/public/**', // optional but handy
      },
    ],
  },
  
  // 👆 END OF 'images' BLOCK

  eslint: {
    // This is the block we added earlier
    ignoreDuringBuilds: true,
  },
  
};

export default nextConfig;