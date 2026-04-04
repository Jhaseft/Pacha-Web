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
};

export default nextConfig;
