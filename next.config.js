const fs = require('fs')
const dotenv = require('dotenv')
const withTM = require('next-transpile-modules')(['@codegouvfr/react-dsfr'])
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const imagesDomains = ['static.data.gouv.fr']

const defaultEnvVarFile = '.env.default'
const defaultEnvVarRaw = dotenv.parse(fs.readFileSync(defaultEnvVarFile))
const defaultEnvVar = Object.fromEntries(Object.entries(defaultEnvVarRaw).filter(([key]) => key.startsWith('NEXT_PUBLIC')))
const envVar = Object.fromEntries(
  Object
    .entries(process.env)
    .filter(([key]) => key.startsWith('NEXT_PUBLIC'))
)

if (envVar.NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE) {
  imagesDomains.push(envVar.NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE)
}

const redirection = async () => [
  {
    source: '/donnees-nationales/reutilisateurs',
    destination: '/donnees-nationales/usages',
    permanent: true
  },
  {
    source: '/donnees-nationales/utilisateurs',
    destination: '/donnees-nationales/usages',
    permanent: true
  },
  {
    source: '/donnees-nationales/base-usages',
    destination: '/donnees-nationales/usages',
    permanent: true
  }
]

const rewritedURL = async () => [
  {
    source: '/data/ban/adresses-odbl/:path*',
    destination: '/data/ban/adresses/:path*',
  }
]

const nextConfig = withTM({
  images: {
    domains: imagesDomains
  },
  compiler: {
    styledComponents: true
  },
  webpack: config => {
    config.module.rules.push({
      test: /\.woff2$/,
      type: 'asset/resource'
    })

    return config
  },
  redirects: redirection,
  rewrites: rewritedURL,
  publicRuntimeConfig: {
    isDevMode: process.env.NODE_ENV !== 'production',
    ...defaultEnvVar,
    ...envVar,
  },
})

module.exports = withBundleAnalyzer(nextConfig)
