import type { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  
  // 👇 ADD (OR UPDATE) THIS 'images' BLOCK
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xvyzpsfpgpbozzcohpxa.supabase.co', // This is your Supabase hostname
        port: '',
        pathname: '/storage/v1/object/public/**', // This allows all images from public buckets
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