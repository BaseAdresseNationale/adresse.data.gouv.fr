const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const imagesDomains = ['static.data.gouv.fr']

if (process.env.NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE) {
  imagesDomains.push(process.env.NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE)
}

module.exports = withBundleAnalyzer({
  images: {
    domains: imagesDomains
  }
})
