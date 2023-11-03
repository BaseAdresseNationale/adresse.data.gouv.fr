const withTM = require('next-transpile-modules')(['@codegouvfr/react-dsfr'])
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const imagesDomains = ['static.data.gouv.fr']

if (process.env.NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE) {
  imagesDomains.push(process.env.NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE)
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
  publicRuntimeConfig: {
    isDevMode: process.env.NODE_ENV !== 'production',
  },
})

module.exports = withBundleAnalyzer(nextConfig)
