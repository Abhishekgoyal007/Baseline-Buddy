/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use the new turbopack config format
  turbopack: {
    root: __dirname,
  },
  // Remove deprecated experimental.turbo
  trailingSlash: false,
  
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  
  // Environment variables available to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
}

module.exports = nextConfig