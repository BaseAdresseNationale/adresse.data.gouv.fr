/** @type {import('next').NextConfig} */

import NextBundleAnalyzer from '@next/bundle-analyzer'
import  fs from 'fs'
import dotenv from 'dotenv'

const defaultEnvVarFile = '.env.default'
const defaultEnvVarRaw = dotenv.parse(fs.readFileSync(defaultEnvVarFile))
const defaultEnvVar = Object.fromEntries(Object.entries(defaultEnvVarRaw).filter(([key]) => key.startsWith('NEXT_PUBLIC')))
const envVar = Object.fromEntries(
  Object
    .entries(process.env)
    .filter(([key]) => key.startsWith('NEXT_PUBLIC'))
)

const NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE = process.env.NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE
const imagesDomains = ['static.data.gouv.fr']
if (NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE) {
  imagesDomains.push(NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE)
}

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = withBundleAnalyzer({
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
    config.resolve.fallback = { fs: false }

    return config
  },
  compiler: {
    styledComponents: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
    instrumentationHook: true,
  },
  transpilePackages: [
    '@codegouvfr/react-dsfr', // Require for the "pages-router" of nextJS
  ],
  publicRuntimeConfig: {
    isDevMode: process.env.NODE_ENV !== 'production',
    ...defaultEnvVar,
    ...envVar,
  },
})

export default nextConfig
