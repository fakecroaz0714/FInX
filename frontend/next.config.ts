import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL 
  ? (process.env.BACKEND_URL.startsWith('http') ? process.env.BACKEND_URL : `http://${process.env.BACKEND_URL}`)
  : 'http://localhost:5001';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
