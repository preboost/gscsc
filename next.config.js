/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
