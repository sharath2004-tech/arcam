/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['172.25.177.32'],
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
