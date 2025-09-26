/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use the new turbopack config format
  turbopack: {
    root: __dirname,
  },
  // Remove deprecated experimental.turbo
  trailingSlash: false,
}

module.exports = nextConfig