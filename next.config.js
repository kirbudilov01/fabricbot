/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    domains: [
      'images.pexels.com',
      'yt3.ggpht.com'
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://fabricbot-backend1.vercel.app',
  }
}

module.exports = nextConfig