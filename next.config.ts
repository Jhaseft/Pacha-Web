import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',       
        pathname: '/**', 
      },
    ],
  },
  // Esto genera la carpeta .next/standalone
  output: 'standalone',
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/@:username',
          destination: '/anfitrionas/:username',
        },
      ],
    };
  },
};

export default nextConfig;
