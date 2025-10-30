/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    // Disable image optimization to avoid issues with external URLs
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  // Production optimizations
  swcMinify: true,
  compress: true,
  // Optimize production builds
  productionBrowserSourceMaps: false,
  // Reduce bundle size
  poweredByHeader: false,
}

module.exports = nextConfig
