/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['172.25.177.32'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
