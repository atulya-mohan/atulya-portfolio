// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https', hostname: '**.supabase.co'
      },
    ],
    // OR: if you want to allow any Supabase project (less strict):
    // remotePatterns: [
    //   { protocol: 'https', hostname: '**.supabase.co', pathname: '/storage/v1/object/public/**' },
    // ],
  },
};

module.exports = nextConfig;
