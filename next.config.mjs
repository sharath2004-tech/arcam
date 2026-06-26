/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['172.25.177.32'],
  // 'export' is required for Capacitor/Android static builds.
  // On Vercel (SSR), NEXT_OUTPUT is not set, so output is undefined (server mode).
  ...(process.env.NEXT_OUTPUT === 'export' && { output: 'export' }),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
