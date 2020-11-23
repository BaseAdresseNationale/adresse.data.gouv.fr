const {join} = require('path')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const commonModules = [
  '/node_modules/fbjs/',
  '/node_modules/next/',
  '/node_modules/lodash/',
  '/node_modules/webpack/',

  '/components/hoc/',

  '/pages/_error.js'
]

module.exports = withBundleAnalyzer({
  webpack(config, {dev, isServer}) {
    // eslint-disable-next-line import/no-extraneous-dependencies
    const {ContextReplacementPlugin} = require('webpack')

    config.plugins.push(
      new ContextReplacementPlugin(/moment[/\\]locale$/, /fr/)
    )

    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups.shared = {
        name: 'commons',
        test: m => m.resource && commonModules.some(c =>
          m.resource.startsWith(join(__dirname, c))
        )
      }
    }

    return config
  }
})
