/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use the new turbopack config format
  turbopack: {
    root: __dirname,
  },
  // Remove deprecated experimental.turbo
  trailingSlash: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig