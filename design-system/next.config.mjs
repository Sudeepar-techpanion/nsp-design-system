/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for registry hosting
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
