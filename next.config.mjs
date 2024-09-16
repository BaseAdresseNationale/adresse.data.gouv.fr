/** @type {import('next').NextConfig} */

const NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE = process.env.NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE
const imagesDomains = ['static.data.gouv.fr']
if (NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE) {
  imagesDomains.push(NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE)
}

const nextConfig = {
  images: {
    remotePatterns: imagesDomains.map(domain => ({
      protocol: 'https',
      hostname: domain,
      port: '',
      pathname: '/**',
    })),
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.woff2$/,
      type: 'asset/resource',
    })
    return config
  },
  compiler: {
    styledComponents: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_BAL_ADMIN_API_URL: process.env.NEXT_PUBLIC_BAL_ADMIN_API_URL,
    NEXT_PUBLIC_API_BAN_URL: process.env.NEXT_PUBLIC_API_BAN_URL,
    NEXT_PUBLIC_API_GEO_URL: process.env.NEXT_PUBLIC_API_GEO_URL,
    NEXT_PUBLIC_GHOST_URL: process.env.NEXT_PUBLIC_GHOST_URL,
    NEXT_PUBLIC_GHOST_KEY: process.env.NEXT_PUBLIC_GHOST_KEY,
    isDevMode: process.env.NODE_ENV !== 'production',
  },
}

export default nextConfig
