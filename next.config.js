const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  images: {
    domains: ['static.data.gouv.fr', process.env.NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE]
  }
})
