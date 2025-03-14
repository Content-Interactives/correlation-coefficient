/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  ...(process.env.NODE_ENV === 'production' ? {
    basePath: '/correlation-coefficient',
    assetPrefix: '/correlation-coefficient',
  } : {})
}

module.exports = nextConfig 