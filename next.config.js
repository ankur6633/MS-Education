/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  // Vercel optimizations
  swcMinify: true,
  compress: true,
}

module.exports = nextConfig
