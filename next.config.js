const withTM = require('next-transpile-modules')(['@codegouvfr/react-dsfr'])
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const imagesDomains = ['static.data.gouv.fr']

if (process.env.NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE) {
  imagesDomains.push(process.env.NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE)
}

const nextConfig = withTM({
  images: {
    domains: imagesDomains
  },
  webpack: config => {
    config.module.rules.push({
      test: /\.woff2$/,
      type: 'asset/resource'
    })

    return config
  }
})

module.exports = withBundleAnalyzer(nextConfig)
