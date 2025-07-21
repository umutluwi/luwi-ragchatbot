/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['luwi.dev', 'demo.luwi.dev'],
    unoptimized: true,
    formats: ['image/webp', 'image/avif']
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5678/:path*'
      }
    ]
  }
}

module.exports = nextConfig