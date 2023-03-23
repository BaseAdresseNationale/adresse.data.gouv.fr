const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const imagesDomains = ['static.data.gouv.fr']

if (process.env.NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE) {
  imagesDomains.push(process.env.NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE)
}

async function redirection() {
  return [
    {
      source: '/donnees-nationales/reutilisateurs',
      destination: '/donnees-nationales/utilisateurs',
      permanent: true
    }
  ]
}

module.exports = withBundleAnalyzer({
  images: {
    domains: imagesDomains
  },
  redirects: redirection
})
