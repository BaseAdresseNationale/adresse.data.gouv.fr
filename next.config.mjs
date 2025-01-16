/** @type {import('next').NextConfig} */

import fs from 'node:fs'
import NextBundleAnalyzer from '@next/bundle-analyzer'
import dotenv from 'dotenv'

const getNextEnv = envVars => Object.fromEntries(
  Object
    .entries(envVars)
    .filter(([key]) => key.startsWith('NEXT_PUBLIC'))
)

const defaultEnvVarFile = '.env.default'
const defaultEnvVarRaw = dotenv.parse(fs.readFileSync(defaultEnvVarFile))
const defaultEnvVar = getNextEnv(defaultEnvVarRaw)
const envVar = getNextEnv(process.env)

const URL_CARTOGRAPHY_BAN = '/carte-base-adresse-nationale'
const NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE = process.env.NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE
const imagesDomains = ['static.data.gouv.fr']
if (NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE) {
  imagesDomains.push(NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE)
}

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const redirects = async () => [
  {
    source: '/ressources',
    destination: '/ressources-et-documentations',
    permanent: true,
  },
  {
    source: '/guides',
    destination: '/documentation-bal',
    permanent: true,
  },
  {
    source: '/gerer-mes-adresses',
    destination: '/programme-bal',
    permanent: true,
  },
  {
    source: '/bases-locales',
    destination: '/programme-bal',
    permanent: true,
  },
  {
    source: '/bases-locales/charte',
    destination: '/communaute/charte-base-adresse-locale',
    permanent: true,
  },
  {
    source: '/bases-locales/charte/communes',
    destination: '/communaute/communes-partenaires',
    permanent: true,
  },
  {
    source: '/bases-locales/charte/companies',
    destination: '/communaute/societes-partenaires',
    permanent: true,
  },
  {
    source: '/bases-locales/charte/organismes',
    destination: '/communaute/organismes-partenaires',
    permanent: true,
  },
  {
    source: '/fantoir',
    destination: '/outils/fantoir',
    permanent: true,
  },
  {
    source: '/fantoir/departement/:departement',
    destination: '/outils/fantoir/:departement',
    permanent: true,
  },
  {
    source: '/fantoir/departement/:departement/commune/:codeCommune',
    destination: '/outils/fantoir/:departement/:codeCommune',
    permanent: true,
  },
  {
    source: '/bases-locales/validateur',
    destination: '/outils/validateur-bal',
    permanent: true,
  },
  {
    source: '/validateur',
    destination: '/outils/validateur-bal',
    permanent: true,
  },
  {
    source: '/bases-locales/publication',
    destination: '/outils/formulaire-de-publication',
    permanent: true,
  },
  {
    source: '/bases-locales/validator-documentation',
    destination: '/outils/formulaire-de-publication',
    permanent: true,
  },
  {
    source: '/bases-locales/temoignages',
    destination: '/blog',
    permanent: true,
  },
  {
    source: '/base-adresse-nationale/:path',
    destination: `${URL_CARTOGRAPHY_BAN}?id=:path`,
    permanent: true,
  },
  {
    source: '/base-adresse-nationale',
    destination: `${URL_CARTOGRAPHY_BAN}`,
    permanent: true,
  },
  {
    source: '/map',
    destination: `${URL_CARTOGRAPHY_BAN}`,
    permanent: true,
  },
  {
    source: '/csv',
    destination: '/outils/csv',
    permanent: true,
  },
  {
    source: '/donnees-nationales',
    destination: '/outils/telechargements',
    permanent: true,
  },
  {
    source: '/download',
    destination: '/outils/telechargements',
    permanent: true,
  },
  {
    source: '/api-doc',
    destination: '/outils',
    permanent: true,
  },
  {
    source: '/api-doc/adresse',
    destination: '/outils/api-doc/adresse',
    permanent: true,
  },
  {
    source: '/api',
    destination: '/outils',
    permanent: true,
  },
  {
    source: '/donnees-nationales/utilisateurs',
    destination: '/communaute/usages',
    permanent: true
  },
  {
    source: '/donnees-nationales/usages',
    destination: '/communaute/usages',
    permanent: true,
  },
  {
    source: '/donnees-nationales/base-usages',
    destination: '/communaute/usages',
    permanent: true
  },
  {
    source: '/contribuer',
    destination: '/nous-contacter',
    permanent: true,
  },
  {
    source: '/contrib',
    destination: '/nous-contacter',
    permanent: true,
  },
  {
    source: '/contact',
    destination: '/nous-contacter',
    permanent: true,
  },
  {
    source: '/indicateurs',
    destination: '/stats',
    permanent: true
  },
  
]

const rewrites = async () => [
  {
    source: '/data/ban/adresses-odbl/:path*',
    destination: '/data/ban/adresses/:path*',
  }
]

const nextConfig = withBundleAnalyzer({
  env: {
    ...defaultEnvVar,
    ...envVar,
  },
  redirects, 
  rewrites,
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
  output: 'standalone',
})

export default nextConfig
