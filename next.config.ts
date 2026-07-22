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
  async headers() {
    return [
      {
        // Apple exige que el AASA (sin extensión) se sirva como application/json.
        source: '/.well-known/apple-app-site-association',
        headers: [{ key: 'Content-Type', value: 'application/json' }],
      },
      {
        source: '/.well-known/assetlinks.json',
        headers: [{ key: 'Content-Type', value: 'application/json' }],
      },
    ];
  },
};

export default nextConfig;
